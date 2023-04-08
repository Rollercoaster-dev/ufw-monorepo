import { DarkenService } from './../../services/darken/darken.service';
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

import { Tailwindest } from 'tailwindest';
import { DraggingDirective } from '../../directives/dragging/dragging.directive';
import { DraggingState } from '../../directives/dragging/draggingstate';

@Component({
  selector: 'ufw-l-pull-tab',
  standalone: true,
  imports: [CommonModule, DraggingDirective],
  template: `
    <div
      class="tab {{ direction }} {{ width }} {{ height }}"
      [ngClass]="classes"
      ufwLDragging
      [dragId]="dragId"
      [style]="style"
      [axis]="axis"
      [min]="min"
      [max]="max"
      [position]="position"
      [absolutePosition]="absolutePosition"
      [returnHomeDuration]="returnHomeDuration"
      [returnHomeDelay]="returnHomeDelay"
      (returningHome)="returningHome.emit()"
      (arrivedHome)="arrivedHome.emit()"
      (distanceTraveled)="handleDistanceTraveled($event)"
      (dragStart)="dragStart.emit()"
      (dragging)="dragging.emit($event)"
      (dragEnd)="dragEnd.emit()"
    >
      <div class="inner-tab h-full w-full{{ direction }}"></div>
    </div>
  `,
  styleUrls: ['./pull-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PullTabComponent {
  @Input() dragId!: string;
  @Input() direction: 'left' | 'right' | 'up' | 'down' = 'left';
  @Input() min = 0;
  @Input() max = Infinity;
  @Input() height: Tailwindest['height'] = 'h-full';
  @Input() width: Tailwindest['width'] = 'w-5';
  @Input() position: 'absolute' | 'relative' = 'relative';
  @Input() absolutePosition: { x: number; y: number } = { x: 0, y: 0 };
  @Input() debug = false;
  @Input() returnHomeDuration = 0;
  @Input() returnHomeDelay = 0;
  @Input() allowReturnHome = true;
  @Input() debounce = 0;

  @Output() distanceTraveled = new EventEmitter<number>();
  @Output() dragStart = new EventEmitter<void>();
  @Output() dragging = new EventEmitter<boolean>();
  @Output() dragEnd = new EventEmitter<void>();
  @Output() returningHome = new EventEmitter<void>();
  @Output() arrivedHome = new EventEmitter<void>();

  #state?: DraggingState;

  constructor(
    private cd: ChangeDetectorRef,
    private darkenService: DarkenService
  ) {}

  get style() {
    return {
      backgroundColor: this.darkenService.backgroundColor,
    };
  }

  get axis() {
    return this.direction === 'left' || this.direction === 'right' ? 'x' : 'y';
  }

  get classes() {
    return {
      [this.height as string]: !!this.height,
      [this.width as string]: !!this.width,
    };
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
