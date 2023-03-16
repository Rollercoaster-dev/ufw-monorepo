import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ufw-l-main',
  standalone: true,
  imports: [CommonModule],
  template: ` <main class="flex flex-col h-full ">
    main
    <ng-content></ng-content>
  </main>`,
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {}
