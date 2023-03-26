import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UfwLogoComponent } from '../ufw-logo/ufw-logo.component';
import { LedTextComponent } from '../led-text/led-text.component';
import { PullOutTabComponent } from '../pull-out-tab/pull-out-tab.component';

@Component({
  selector: 'ufw-l-header',
  standalone: true,
  template: `
    <header
      class="flex flex-grow flex-col content-center justify-center flex-wrap h-full"
    >
      <ufw-l-logo class="mx-auto mt-auto"></ufw-l-logo>
      <ufw-l-pull-out-tab class="mb-auto mx-auto">
        <ufw-l-led-text class="mx-auto mb-auto mt-12">
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
  @HostBinding('class') class = 'flex-grow h-full';
}
