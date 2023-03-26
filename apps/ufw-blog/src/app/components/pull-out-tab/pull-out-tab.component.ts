import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PullTabComponent } from '../pulll-tab/pull-tab.component';

@Component({
  selector: 'ufw-l-pull-out-tab',
  standalone: true,
  template: `
    <ng-content></ng-content>
    <div class="pull-tab w-20 h-10">
      <ufw-l-pull-tab
        direction="down"
        height="h-5"
        width="w-20"
        [min]="400"
        [max]="700"
      ></ufw-l-pull-tab>
    </div>
  `,
  styleUrls: ['./pull-out-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PullTabComponent],
})
export class PullOutTabComponent {}
