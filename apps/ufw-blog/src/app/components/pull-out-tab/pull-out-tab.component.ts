import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PullTabComponent } from '../pulll-tab/pull-tab.component';

@Component({
  selector: 'ufw-l-pull-out-tab',
  standalone: true,
  template: `
    <ng-content></ng-content>
    <div class="pull-tab w-20 h-10">
      <ufw-l-pull-tab
        #tab
        [debug]="true"
        direction="down"
        height="h-5"
        width="w-20"
        [min]="min"
        [max]="700"
      ></ufw-l-pull-tab>
    </div>
  `,
  styleUrls: ['./pull-out-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PullTabComponent],
})
export class PullOutTabComponent implements AfterViewInit {
  tabRect?: DOMRect;
  min = 0;
  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    console.log('PullOutTabComponent');
    this.tabRect = this.elRef.nativeElement
      .querySelector('ufw-l-pull-tab')
      .getBoundingClientRect();
    this.min = this.elRef.nativeElement
      .querySelector('ufw-l-pull-tab')
      .getBoundingClientRect().top;
    console.log('PullOutTabComponent', this.min);
  }
}
