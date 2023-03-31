import { DarkenService } from './services/darken/darken.service';
import { RouterModule } from '@angular/router';
import { Component, HostBinding, OnInit } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  standalone: true,
  selector: 'ufw-l-root',
  template: `
    <ufw-l-header />
    <!-- <ufw-l-main class="{{ darkenService.backgroundColor }} {{ darkenService.getTextColor() }}" /> -->
    <ufw-l-footer />
  `,
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, HeaderComponent, MainComponent, FooterComponent],
})
export class AppComponent {}
