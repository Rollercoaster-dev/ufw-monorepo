import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UfwLogoComponent } from '../../ufw-logo/ufw-logo.component';

@Component({
  selector: 'ufw-l-header',
  standalone: true,
  template: `
    <header class="flex flex-col h-full ">
      <div>
        <ufw-l-logo></ufw-l-logo>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, UfwLogoComponent],
})
export class HeaderComponent {}
