import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';

import {
  debounceTime,
  fromEvent,
  merge,
  Subject,
  takeUntil,
  timer,
} from 'rxjs';

@Directive({
  selector: '[ufwLDragging]',
  standalone: true,
})
export class DraggingDirective implements AfterViewInit, OnDestroy {
  #initialPosition = { x: 0, y: 0 };
  #initialMousePosition = { x: 0, y: 0 };
  #dragging = false;
  #distanceTraveled = 0;

  @Input() axis: 'x' | 'y' = 'x'; // specify the axis along which the element can be dragged

  @Input() min = 0; // specify the maximum distance the element can be dragged
  @Input() max = Infinity; // specify the maximum distance the element can be dragged
  @Input() lockToPosition = false; // specify whether the element should be locked to the position it was dragged to
  @Input() position: 'relative' | 'absolute' = 'relative';
  @Input() absolutePosition: { x: number; y: number } = { x: 0, y: 0 };
  @Input() returnHomeDuration?: number;
  @Input() returnHomeDelay = 0;

  private destroy$ = new Subject<void>();

  get minValue() {
    return this.lockToPosition
      ? this.#initialPosition[this.axis] + this.min
      : this.min;
  }

  get maxValue() {
    return this.lockToPosition
      ? this.#initialPosition[this.axis] + this.max
      : this.max;
  }

  constructor(private elRef: ElementRef, private zone: NgZone) {}

  @Output() distanceTraveled = new EventEmitter<number>();

  @Output() dragging = new EventEmitter<boolean>();
  @Output() dragStart = new EventEmitter<void>();
  @Output() dragEnd = new EventEmitter<void>();
  @Output() returningHome = new EventEmitter<void>();
  @Output() arrivedHome = new EventEmitter<void>();

  @HostBinding('class.dragging') get draggingClass() {
    return this.#dragging;
  }

  ngAfterViewInit() {
    this.elRef.nativeElement.style.position = this.position;
    if (this.position === 'absolute') {
      this.elRef.nativeElement.style.left = `${this.absolutePosition.x}px`;
      this.elRef.nativeElement.style.top = `${this.absolutePosition.y}px`;
    }
    const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const touchMove$ = fromEvent<TouchEvent>(document, 'touchmove');

    const move$ = merge(mouseMove$, touchMove$);

    // Apply the debounceTime operator to debounce the events
    move$
      .pipe(
        debounceTime(8), // Adjust the debounce time as needed
        takeUntil(this.destroy$) // Unsubscribe when the component is destroyed
      )
      .subscribe((event: MouseEvent | TouchEvent) => {
        this.onMouseMove(event);
      });
  }
  returnToHome(duration: number) {
    const startTime = performance.now();
    const startDistance = this.#distanceTraveled;

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const distanceToMove = startDistance * (1 - progress);
      this.elRef.nativeElement.style.transform =
        this.axis === 'x'
          ? `translateX(${distanceToMove}px)`
          : `translateY(${distanceToMove}px)`;

      this.distanceTraveled.emit(distanceToMove);
      this.#distanceTraveled = distanceToMove;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure we reach the home position
        this.elRef.nativeElement.style.transform = 'translate(0, 0)';
        this.distanceTraveled.emit(0);
        this.#distanceTraveled = 0;
      }
    };

    requestAnimationFrame(animate);
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: MouseEvent | TouchEvent) {
    this.#dragging = true;

    const touch = (event as TouchEvent).touches?.[0] || (event as MouseEvent);

    const clientX = touch.clientX;
    const clientY = touch.clientY;
    // Store the initial position of the element
    this.#initialPosition = {
      x: this.elRef.nativeElement.offsetLeft,
      y: this.elRef.nativeElement.offsetTop,
    };

    // Calculate the initial mouse/touch position
    this.#initialMousePosition = {
      x: clientX - this.#initialPosition.x,
      y: clientY,
    };

    this.dragging.emit(true);
    this.dragStart.emit();
  }

  onMouseMove(event: MouseEvent | TouchEvent) {
    if (!this.#dragging) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      const touch = (event as TouchEvent).touches?.[0] || (event as MouseEvent);
      const { clientY, pageY } = touch;
      if (clientY > pageY) {
        event.preventDefault();
      }
      const clientAxis = this.axis === 'x' ? touch.clientX : touch.clientY;
      const distance =
        this.axis === 'y'
          ? clientAxis - this.#initialPosition[this.axis]
          : clientAxis - this.#initialMousePosition[this.axis];
      const newValue = Math.max(
        Math.min(this.#initialPosition[this.axis] + distance, this.maxValue),
        this.minValue
      );
      const distanceTraveled = newValue - this.#initialPosition[this.axis];
      this.elRef.nativeElement.style.transform =
        this.axis === 'x'
          ? `translateX(${distanceTraveled}px)`
          : `translateY(${distanceTraveled}px)`;
      this.distanceTraveled.emit(distanceTraveled);
      this.#distanceTraveled = distanceTraveled;
    });
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onMouseUp(event: MouseEvent | TouchEvent) {
    if (!this.#dragging) {
      return;
    }
    this.#dragging = false;
    this.dragging.emit(false);
    this.dragEnd.emit();

    timer(this.returnHomeDelay).subscribe(() => {
      if (this.returnHomeDuration && !this.#dragging) {
        this.returnToHome(this.returnHomeDuration);
      }
    });

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('touchmove', this.onMouseMove);
  }

  ngOnDestroy() {
    // Notify the destroy$ subject to complete any active RxJS subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}
