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

  constructor(private elRef: ElementRef, private zone: NgZone) {}

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
  onMouseDown(event: MouseEvent) {
    this.#dragging = true;

    this.#initialX = event.clientX;
    this.#initialY = event.clientY;

    // Store the initial position of the element
    this.#initialPosition = {
      x: this.elRef.nativeElement.offsetLeft,
      y: this.elRef.nativeElement.offsetTop,
    };
    this.dragging.emit(true);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.#dragging) {
      event.preventDefault();
      this.zone.runOutsideAngular(() => {
        const dx = event.clientX - this.#initialPosition.x;
        const dy = event.clientY - this.#initialPosition.y;

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
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.#dragging = false;
    this.dragging.emit(false);
  }
}
