import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggingDirective } from '../../dragging/dragging.directive';
import { Tailwindest } from 'tailwindest';
@Component({
  selector: 'ufw-l-pull-tab',
  standalone: true,
  imports: [CommonModule, DraggingDirective],
  template: `
    <div
      class="tab {{ height }} {{ width }}"
      ufwLDragging
      [axis]="axis"
      [style]="{ width: max }"
      [min]="min"
      [max]="max"
      (distanceTraveled)="handleDistanceTraveled($event)"
      [position]="position"
      [absolutePosition]="absolutePosition"
    >
      <div class="inner-tab h-full w-full{{ direction }}"></div>
    </div>
  `,
  styleUrls: ['./pull-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PullTabComponent {
  @Input() direction: 'left' | 'right' | 'up' | 'down' = 'left';
  @Input() min = 0;
  @Input() max = Infinity;
  @Input() height: Tailwindest['height'] = 'h-full';
  @Input() width: Tailwindest['width'] = 'w-5';
  @Input() position: 'absolute' | 'relative' = 'relative';
  @Input() absolutePosition: { x: number; y: number } = { x: 0, y: 0 };
  @Input() debug = false;

  @Output() distanceTraveled = new EventEmitter<number>();

  constructor(private cd: ChangeDetectorRef) {}

  get axis() {
    return this.direction === 'left' || this.direction === 'right' ? 'x' : 'y';
  }

  @HostBinding('class') get class() {
    return `ufw-pull-tab ufw-${this.direction}`;
  }

  handleDistanceTraveled(distance: number) {
    this.distanceTraveled.emit(distance);
    if (this.debug)
      console.log('distanceTraveled', { distance, axis: this.axis });
    this.cd.detectChanges();
  }
}
