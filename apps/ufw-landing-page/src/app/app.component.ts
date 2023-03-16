import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'ufw-l-root',
  template: ` <ufw-l-nx-welcome></ufw-l-nx-welcome> `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ufw-landing-page';
}
