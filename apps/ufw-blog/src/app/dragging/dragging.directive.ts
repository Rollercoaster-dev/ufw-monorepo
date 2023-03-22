import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  NgZone,
  Output,
} from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Directive({
  selector: '[ufwLDragging]',
  standalone: true,
})
export class DraggingDirective implements AfterViewInit {
  #initialX = 0;
  #initialY = 0;
  #initialPosition = { x: 0, y: 0 };

  #dragging = false;

  @Input() axis: 'x' | 'y' = 'x'; // specify the axis along which the element can be dragged

  @Input() min = 0; // specify the maximum distance the element can be dragged
  @Input() max = Infinity; // specify the maximum distance the element can be dragged
  @Input() lockToPosition = false; // specify whether the element should be locked to the position it was dragged to
  @Input() position: 'relative' | 'absolute' = 'relative';
  @Input() absolutePosition: { x: number; y: number } = { x: 0, y: 0 };
  get minValue() {
    const axis =
      this.axis === 'x' ? this.#initialPosition.x : this.#initialPosition.y;
    return this.lockToPosition ? axis + this.min : this.min;
  }

  get maxValue() {
    const axis =
      this.axis === 'x' ? this.#initialPosition.x : this.#initialPosition.y;
    return this.lockToPosition ? axis + this.max : this.max;
  }

  private debouncedMove$ = new Subject<MouseEvent | TouchEvent>();

  constructor(private elRef: ElementRef, private zone: NgZone) {
    this.debouncedMove$
      .pipe(debounceTime(10))
      .subscribe((event) => this.performDrag(event));
  }

  @Output() distanceTraveled = new EventEmitter<number>();

  @Output() dragging = new EventEmitter<boolean>();

  ngAfterViewInit() {
    this.elRef.nativeElement.style.position = this.position;
    if (this.position === 'absolute') {
      this.elRef.nativeElement.style.left = `${this.absolutePosition.x}px`;
      this.elRef.nativeElement.style.top = `${this.absolutePosition.y}px`;
    }
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: MouseEvent | TouchEvent) {
    const touch = (event as TouchEvent).touches?.[0] || (event as MouseEvent);
    this.#dragging = true;

    this.#initialX = touch.clientX;
    this.#initialY = touch.clientY;

    // Store the initial position of the element
    this.#initialPosition = {
      x: this.elRef.nativeElement.offsetLeft,
      y: this.elRef.nativeElement.offsetTop,
    };
    this.dragging.emit(true);
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onMouseMove(event: MouseEvent | TouchEvent) {
    if (this.#dragging) {
      event.preventDefault();
      this.debouncedMove$.next(event);
    }
  }

  performDrag(event: MouseEvent | TouchEvent) {
    const touch = (event as TouchEvent).touches?.[0] || (event as MouseEvent);

    this.zone.runOutsideAngular(() => {
      const dx = touch.clientX - this.#initialPosition.x;
      const dy = touch.clientY - this.#initialPosition.y;

      let distanceTraveled = 0;

      if (this.axis === 'x') {
        const newX = Math.max(
          Math.min(this.#initialPosition.x + dx, this.maxValue),
          this.minValue
        );
        distanceTraveled = newX - this.#initialPosition.x;
        this.elRef.nativeElement.style.transform = `translateX(${distanceTraveled}px)`;
        this.distanceTraveled.emit(distanceTraveled);
      } else if (this.axis === 'y') {
        const newY = Math.max(
          Math.min(this.#initialPosition.y + dy, this.maxValue),
          this.minValue
        );
        distanceTraveled = newY - this.#initialPosition.y;
        this.elRef.nativeElement.style.transform = `translateY(${distanceTraveled}px)`;
        this.distanceTraveled.emit(distanceTraveled);
      }
    });
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onMouseUp(event: MouseEvent | TouchEvent) {
    this.#dragging = false;
    this.dragging.emit(false);
  }
}
