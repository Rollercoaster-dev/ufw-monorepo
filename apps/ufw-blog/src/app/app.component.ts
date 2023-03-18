import { RouterModule } from '@angular/router';
import { Component, HostBinding } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  standalone: true,
  selector: 'ufw-l-root',
  template: `
    <ufw-l-header class="flex-grow " />
    <!-- <ufw-l-main> </ufw-l-main> -->
    <ufw-l-footer />
  `,
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, HeaderComponent, MainComponent, FooterComponent],
})
export class AppComponent {}
