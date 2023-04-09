import { DarkenService } from './services/darken/darken.service';
import { RouterModule } from '@angular/router';
import { Component, HostBinding, OnInit } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';
import { DisablePullToRefreshDirective } from './directives/disable-pull-to-refresh/disable-pull-to-refresh.directive';

@Component({
  standalone: true,
  selector: 'ufw-l-root',
  template: `
    <div ufwLDisablePullToRefresh class="w-full h-full flex flex-col ">
      <ufw-l-header />
      <!-- <ufw-l-main class="{{ darkenService.backgroundColor }} {{ darkenService.getTextColor() }}" /> -->
      <ufw-l-footer />
    </div>
  `,
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterModule,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    DisablePullToRefreshDirective,
  ],
})
export class AppComponent {}
