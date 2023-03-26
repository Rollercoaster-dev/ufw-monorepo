import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ufw-l-led-text',
  standalone: true,
  imports: [CommonModule],
  template: ` <ng-content></ng-content>`,
  styleUrls: ['./led-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedTextComponent {
  @Input() ledId!: string;
}
