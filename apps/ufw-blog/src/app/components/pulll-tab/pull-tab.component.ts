import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggingDirective } from '../../dragging/dragging.directive';

@Component({
  selector: 'ufw-l-pull-tab',
  standalone: true,
  imports: [CommonModule, DraggingDirective],
  template: `
    <div
      class="tab h-full w-5"
      ufwLDragging
      [min]="min"
      [max]="max"
      [style]="{ width: max }"
      (distanceTraveled)="handleDistanceTraveled($event)"
      [position]="position"
      [absolutePosition]="absolutePosition"
    >
      <div class="inner-tab h-full {{ direction }}"></div>
    </div>
  `,
  styleUrls: ['./pull-tab.component.scss'],
})
export class PullTabComponent {
  @Input() direction: 'left' | 'right' | 'up' | 'down' = 'left';
  @Input() min = 0;
  @Input() max = Infinity;
  @Input() position: 'absolute' | 'relative' = 'relative';
  @Input() absolutePosition: { x: number; y: number } = { x: 0, y: 0 };
  @Input() debug = false;

  @Output() distanceTraveled = new EventEmitter<number>();

  handleDistanceTraveled(distance: number) {
    this.distanceTraveled.emit(distance);
    if (this.debug) console.log('distanceTraveled', distance);
  }
}
