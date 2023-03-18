import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UfwLogoComponent } from '../../ufw-logo/ufw-logo.component';

@Component({
  selector: 'ufw-l-header',
  standalone: true,
  template: `
    <header
      class="flex flex-grow flex-col content-center justify-center flex-wrap h-full"
    >
      <ufw-l-logo class="m-auto"></ufw-l-logo>
    </header>
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, UfwLogoComponent],
})
export class HeaderComponent {
  @HostBinding('class') class = 'flex-grow h-full';
}
