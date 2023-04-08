import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dragging } from '../../directives/dragging/draggingstate';
import { Tailwindest } from 'tailwindest';
import { DarkenService } from '../../services/darken/darken.service';

@Component({
  selector: 'ufw-l-base-draggable',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseDraggableComponent extends Dragging implements OnInit {
  constructor(private darkenService: DarkenService) {
    super();
  }
  @Input() direction: 'left' | 'right' | 'up' | 'down' = 'left';
  @Input() override min = 0;
  @Input() override max = Infinity;
  @Input() height: Tailwindest['height'] = 'h-full';
  @Input() width: Tailwindest['width'] = 'w-5';
  @Input() override position: 'absolute' | 'relative' = 'relative';
  @Input() override absolutePosition: { x: number; y: number } = { x: 0, y: 0 };
  @Input() debug = false;
  @Input() override returnHomeDuration = 0;
  @Input() override returnHomeDelay = 0;
  @Input() override allowReturnHome = true;
  @Input() dragId!: string;

  @HostBinding('class') get class() {
    return `ufw-pull-tab ufw-${this.direction}`;
  }

  ngOnInit(): void {
    this.axis =
      this.direction === 'left' || this.direction === 'right' ? 'x' : 'y';
  }

  get classes() {
    return {
      [this.height as string]: !!this.height,
      [this.width as string]: !!this.width,
    };
  }

  get style() {
    return {
      width: this.max,
      backgroundColor: this.darkenService.backgroundColor,
    };
  }
}
