import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ufw-l-led-text',
  standalone: true,
  imports: [CommonModule],
  template: ` <ng-content></ng-content> `,
  styleUrls: ['./led-text.component.scss'],
})
export class LedTextComponent {}
