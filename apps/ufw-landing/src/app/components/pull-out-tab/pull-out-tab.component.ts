import { DarkenService } from './../../services/darken/darken.service';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PullTabComponent } from '../pulll-tab/pull-tab.component';
import { DraggableStateManager } from '../../directives/dragging/draggingStateManager.service';

@Component({
  selector: 'ufw-l-pull-out-tab',
  standalone: true,
  template: `
    <ng-content></ng-content>
    <div class="pull-container flex flex-col items-center">
      <div
        #pullOut
        class="pull-tab w-20 transition-all {{
          hide ? 'min-h-[0px]' : 'min-h-[20px]'
        }}"
      >
        <ufw-l-pull-tab
          #tab
          class="mt-3 opacity-0"
          direction="down"
          height="h-5"
          width="w-20"
          [dragId]="dragId"
          [min]="min"
          [max]="max"
          (dragEnd)="dragEnd.emit()"
          (dragStart)="dragStart.emit()"
          (dragging)="dragging.emit($event)"
          (arrivedHome)="arrivedHome.emit()"
          (returningHome)="returningHome.emit()"
          [returnHomeDuration]="returnHomeDuration"
          [returnHomeDelay]="returnHomeDelay"
        ></ufw-l-pull-tab>
      </div>
    </div>
  `,
  styleUrls: ['./pull-out-tab.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PullTabComponent],
})
export class PullOutTabComponent implements AfterViewInit {
  @ViewChild('tab') tab: ElementRef | undefined;
  @ViewChild('pullOut') pullOut: ElementRef | undefined;
  tabRect?: DOMRect;
  @Input() dragId!: string;
  @Input() min = 0;
  @Input() max = Infinity;
  @Input() returnHomeDuration = 1000;
  @Input() returnHomeDelay = 0;
  @Input() hide = false;

  @Output() distanceTraveled = new EventEmitter<number>();
  @Output() dragStart = new EventEmitter<void>();
  @Output() dragEnd = new EventEmitter<void>();
  @Output() dragging = new EventEmitter<boolean>();
  @Output() returningHome = new EventEmitter<void>();
  @Output() arrivedHome = new EventEmitter<void>();

  constructor(
    private elRef: ElementRef,
    private dragStateManager: DraggableStateManager
  ) {}

  @HostBinding('class') class = 'h-[200px]';

  ngAfterViewInit(): void {
    this.tabRect = this.elRef.nativeElement
      .querySelector('ufw-l-pull-tab')
      .getBoundingClientRect();
    this.min = this.elRef.nativeElement
      .querySelector('ufw-l-pull-tab')
      .getBoundingClientRect().top;
    const state = this.dragStateManager.getState(this.dragId);
    if (state) {
      state.distanceTraveled$.subscribe((amount) => {
        this.updatePullOut(amount);
      });
    }
  }

  handleDistanceTraveled(amount: number) {
    if (!this.hide) {
      this.updatePullOut(amount);
      this.distanceTraveled.emit(amount);
    }
  }

  updatePullOut(amount: number) {
    if (this.pullOut) {
      this.pullOut.nativeElement.style.height = `${amount}px`;
    }
  }
}
