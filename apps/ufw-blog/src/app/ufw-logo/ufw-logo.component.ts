import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ufw-l-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <div class="logo-container flex items-center" (click)="onClick()">
        <div class="U text-4xl font-bold">U</div>
        <div class="Utterly hidden-text text-base">tterly</div>
        <div class="F text-4xl font-bold">F</div>
        <div class="Fucking hidden-text text-base">ucking</div>
        <div class="W text-4xl font-bold">W</div>
        <div class="Wonderful hidden-text text-base">onderful</div>
      </div>
    </div>
  `,
  styleUrls: ['./ufw-logo.component.scss'],
})
export class UfwLogoComponent {
  onClick() {
    const logoContainer = document.querySelector('.logo-container');
    logoContainer?.classList.add('clicked');
    setTimeout(() => {
      logoContainer?.classList.remove('clicked');
    }, 200);
  }
}
