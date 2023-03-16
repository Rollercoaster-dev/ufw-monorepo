import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  standalone: true,
  selector: 'ufw-l-root',
  template: `
    <ufw-l-header />
    <ufw-l-main class="flex-grow">
      <div><h1>Hi from main</h1></div>
    </ufw-l-main>
    <ufw-l-footer />
  `,
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, HeaderComponent, MainComponent, FooterComponent],
})
export class AppComponent {
  title = 'ufw-blog';
}
