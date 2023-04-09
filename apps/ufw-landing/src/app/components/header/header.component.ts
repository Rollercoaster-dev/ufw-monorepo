import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UfwLogoComponent } from '../ufw-logo/ufw-logo.component';
import { LedTextComponent } from '../led-text/led-text.component';
import { PullOutTabComponent } from '../pull-out-tab/pull-out-tab.component';
import { DarkenService } from '../../services/darken/darken.service';
import { combineLatest, timer } from 'rxjs';
import { DraggableStateManager } from '../../directives/dragging/draggingStateManager.service';
import { DraggingState } from '../../directives/dragging/draggingstate';

@Component({
  selector: 'ufw-l-header',
  standalone: true,
  template: `
    <header
      class="flex flex-grow flex-col content-center justify-center flex-wrap h-full"
    >
      <ufw-l-logo class="mx-auto mt-auto"></ufw-l-logo>
      <ufw-l-pull-out-tab
        class="mb-auto mx-auto"
        dragId="pull-out-header"
        [hide]="hidePullout"
        [min]="20"
        [max]="700"
        (dragStart)="onDragStart()"
        (dragEnd)="onDragEnd()"
        [returnHomeDuration]="1000"
        [returnHomeDelay]="4000"
      >
        <ufw-l-led-text class="mx-auto mb-auto mt-12" [lightLed]="lightLed">
          coming soon!
        </ufw-l-led-text>
      </ufw-l-pull-out-tab>
    </header>
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    UfwLogoComponent,
    LedTextComponent,
    PullOutTabComponent,
  ],
})
export class HeaderComponent implements AfterViewInit {
  #sliderState: DraggableStateManager = inject(DraggableStateManager);
  #sliders = ['pull-out-header', 'logo'];
  logoState!: DraggingState;
  pullOutState!: DraggingState;
  #darkenService: DarkenService = inject(DarkenService);
  #cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  lightLed = false;
  hidePullout = true;

  @HostBinding('class') class = 'flex-grow h-full';

  ngAfterViewInit() {
    this.logoState = this.#sliderState.getState('logo');
    this.pullOutState = this.#sliderState.getState('pull-out-header');
    this.logoState.allowReturnHome = false;
    this.logoState.adjustMaxBy = -150;
    this.pullOutState.adjustMaxBy = -560;
    combineLatest({
      logoMaxReached: this.logoState.isMaxReached$,
      logoDistance: this.logoState.distanceTraveled$,
      logoAllowReturn: this.logoState.allowReturnHome$,

      pulloutMaxReached: this.pullOutState.isMaxReached$,
      pulloutDistance: this.pullOutState.distanceTraveled$,
      pulloutAllowReturn: this.pullOutState.allowReturnHome$,
    }).subscribe(
      ({
        logoMaxReached,
        pulloutMaxReached,
        pulloutDistance,
        logoDistance,
        logoAllowReturn,
      }) => {
        console.log({
          pulloutDistance,
        });

        if (logoMaxReached) {
          this.hidePullout = false;
        }
        console.log({ pulloutMaxReached });
        if (pulloutMaxReached) {
          this.logoState.allowReturnHome = true;
          timer(5000).subscribe(() => {
            this.returnToLight();
          });
        }

        this.onDistanceTraveled(pulloutDistance);
      }
    );
  }

  onDragStart() {
    this.#darkenService.setDarkNoOpacity();
  }

  onDistanceTraveled(amount: number) {
    const scaleAmount = this.#darkenService.mapToRange(amount, [0, 196]);

    this.#darkenService.opacityValue = scaleAmount;
  }
  returnToLight() {
    setInterval(() => {
      this.#darkenService.opacityValue =
        this.#darkenService.opacityValue - 0.005;
    }, 100);
  }

  onDragEnd() {
    console.log('drag end');
    this.lightLed = true;
    timer(4000).subscribe(() => {
      this.lightLed = false;
      this.#cdRef.markForCheck();
      console.log('light off', this.lightLed);
    });
  }
}
