import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';

import {
  debounceTime,
  fromEvent,
  merge,
  Subject,
  takeUntil,
  timer,
} from 'rxjs';
import { DraggingState } from './draggingstate';
import { DraggableStateManager } from './draggingStateManager.service';

@Directive({
  selector: '[ufwLDragging]',
  standalone: true,
})
export class DraggingDirective implements AfterViewInit, OnChanges, OnDestroy {
  constructor(
    private elRef: ElementRef,
    private zone: NgZone,
    private stateManager: DraggableStateManager
  ) {}

  #initialPosition: { x: number; y: number } = { x: 0, y: 0 };
  #initialMousePosition: { x: number; y: number } = { x: 0, y: 0 };

  @Input()
  set dragId(value: string | null) {
    this.#state.dragId = value;
  }
  get dragId() {
    if (this.#state.dragId) {
      return this.#state.dragId;
    }
    return null;
  }
  @Input() axis: 'x' | 'y' = 'x'; // specify the axis the element can be dragged on
  @Input() min = 0; // specify the maximum distance the element can be dragged
  @Input() // specify the maximum distance the element can be dragged
  set max(value: number) {
    this.#state.max = value;
  }
  get max() {
    return this.#state.max;
  }
  @Input() lockToPosition = false;
  @Input() position: 'relative' | 'absolute' = 'relative';
  @Input() absolutePosition: { x: number; y: number } = { x: 0, y: 0 };
  @Input() returnHomeDuration = 1000;
  @Input() returnHomeDelay = 0;
  @Input()
  set allowReturnHome(value: boolean) {
    this.#state.allowReturnHome = value;
  }
  get allowReturnHome() {
    return this.#state.allowReturnHome;
  }
  @Input() debounce = 0;
  #state = new DraggingState();

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

  @Output() distanceTraveled = new EventEmitter<number>();
  @Output() dragging = new EventEmitter<boolean>();
  @Output() dragStart = new EventEmitter<void>();
  @Output() dragEnd = new EventEmitter<void>();
  @Output() returningHome = new EventEmitter<void>();
  @Output() arrivedHome = new EventEmitter<void>();

  @HostBinding('class.dragging') get draggingClass() {
    return this.#state.dragging;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.dragId && this.stateManager.hasDraggingInstance(this.dragId)) {
      this.stateManager.setDraggingInstance(this.dragId, this.#state);
    } else {
      if (this.dragId) {
        this.stateManager.createDraggingInstance(this.dragId, this.#state);
      }
    }
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
        debounceTime(this.debounce), // Adjust the debounce time as needed
        takeUntil(this.destroy$) // Unsubscribe when the component is destroyed
      )
      .subscribe((event: MouseEvent | TouchEvent) => {
        this.onMouseMove(event);
      });
  }
  returnToHome(duration: number) {
    if (!this.allowReturnHome) {
      return;
    }
    const startTime = performance.now();
    const startDistance = this.#state.distanceTraveled;

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const distanceToMove = startDistance * (1 - progress);
      this.elRef.nativeElement.style.transform =
        this.axis === 'x'
          ? `translateX(${distanceToMove}px)`
          : `translateY(${distanceToMove}px)`;

      this.distanceTraveled.emit(distanceToMove);
      this.#state.distanceTraveled = distanceToMove;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure we reach the home position
        this.elRef.nativeElement.style.transform = 'translate(0, 0)';
        this.distanceTraveled.emit(0);
        this.#state.distanceTraveled = 0;
      }
    };

    requestAnimationFrame(animate);
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: MouseEvent | TouchEvent) {
    this.#state.dragging = true;

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
    if (!this.#state.dragging) {
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
      this.#state.distanceTraveled = distanceTraveled;
    });
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onMouseUp(event: MouseEvent | TouchEvent) {
    if (!this.#state.dragging) {
      return;
    }
    this.#state.dragging = false;
    this.dragging.emit(false);
    this.dragEnd.emit();

    timer(this.returnHomeDelay).subscribe(() => {
      if (this.returnHomeDuration && !this.#state.dragging) {
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
