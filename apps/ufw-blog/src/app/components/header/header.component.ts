import {
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
import { timer } from 'rxjs';

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
        [min]="20"
        [max]="700"
        (distanceTraveled)="onDistanceTraveled($event)"
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
export class HeaderComponent {
  #darkenService: DarkenService = inject(DarkenService);
  #cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  lightLed = false;
  @HostBinding('class') class = 'flex-grow h-full';

  onDragStart() {
    this.#darkenService.setDarkNoOpacity();
  }

  onDistanceTraveled(amount: number) {
    const scaleAmount = this.#darkenService.mapToRange(amount, [0, 196]);

    this.#darkenService.opacityValue = scaleAmount;
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
