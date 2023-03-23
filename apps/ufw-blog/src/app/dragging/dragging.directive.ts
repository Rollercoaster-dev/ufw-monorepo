import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  Output,
} from '@angular/core';
import { debounceTime, Subject, takeWhile } from 'rxjs';

@Directive({
  selector: '[ufwLDragging]',
  standalone: true,
})
export class DraggingDirective implements AfterViewInit {
  #initialPosition = { x: 0, y: 0 };
  #initialMousePosition = { x: 0, y: 0 };
  #dragging = false;
  #initialOffset = { x: 0, y: 0 };
  #animationFrameId: number | null = null;

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

  constructor(private elRef: ElementRef, private zone: NgZone) {}

  @Output() distanceTraveled = new EventEmitter<number>();

  @Output() dragging = new EventEmitter<boolean>();

  ngAfterViewInit() {
    this.elRef.nativeElement.style.position = this.position;
    if (this.position === 'absolute') {
      this.elRef.nativeElement.style.left = `${this.absolutePosition.x}px`;
      this.elRef.nativeElement.style.top = `${this.absolutePosition.y}px`;
    }
    // Add passive event listeners
    document.addEventListener('mousemove', this.onMouseMove.bind(this), {
      passive: true,
    });
    document.addEventListener('touchmove', this.onMouseMove.bind(this), {
      passive: true,
    });
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: MouseEvent | TouchEvent) {
    this.#dragging = true;

    const touch = (event as TouchEvent).touches?.[0] || (event as MouseEvent);
    const clientAxis = this.axis === 'x' ? touch.clientX : touch.clientY;

    // Store the initial position of the element
    this.#initialPosition = {
      x: this.elRef.nativeElement.offsetLeft,
      y: this.elRef.nativeElement.offsetTop,
    };
    // Calculate the initial mouse/touch position
    this.#initialMousePosition = {
      x: clientAxis - this.#initialPosition.x,
      y: clientAxis - this.#initialPosition.y,
    };

    this.dragging.emit(true);
  }

  onMouseMove(event: MouseEvent | TouchEvent) {
    if (!this.#dragging) {
      return;
    }

    // event.preventDefault();
    const touch = (event as TouchEvent).touches?.[0] || (event as MouseEvent);

    this.zone.runOutsideAngular(() => {
      const clientAxis = this.axis === 'x' ? touch.clientX : touch.clientY;
      const distance = clientAxis - this.#initialMousePosition[this.axis];
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
    });
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onMouseUp() {
    this.#dragging = false;
    this.dragging.emit(false);

    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('touchmove', this.onMouseMove.bind(this));
  }
}
