import {
  Component,
  ElementRef,
  NgZone,
  ViewChild,
  AfterViewInit,
  HostBinding,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggingDirective } from '../../dragging/dragging.directive';
import { PullTabComponent } from '../pulll-tab/pull-tab.component';

@Component({
  selector: 'ufw-l-logo',
  standalone: true,
  template: `
    <div class="flex m-auto">
      <div class="logo-container flex items-center select-none" #logoContainer>
        <div class="U ">u</div>
        <div class="Utterly hidden-text ">tterly</div>
        <div class="F ">f</div>
        <div class="Fucking hidden-text">ucking</div>
        <div class="W ">w</div>
        <div class="Wonderful hidden-text">onderful</div>
      </div>
      <ufw-l-pull-tab
        #tab
        [min]="minSlide - 4"
        [max]="maxSlide + 20"
        [style]="{ width: maxSlide }"
        position="absolute"
        [absolutePosition]="{
          x: logoContainer.getBoundingClientRect().width + 8,
          y: 8
        }"
        (distanceTraveled)="handleDistanceTraveled($event)"
        [debug]="true"
      ></ufw-l-pull-tab>
    </div>
  `,
  styleUrls: ['./ufw-logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DraggingDirective, PullTabComponent],
})
export class UfwLogoComponent implements AfterViewInit {
  private hiddenTextElements: HTMLElement[] = [];
  private letterWidths = [0, 0, 0];

  totalTravel = 0;
  maxTravel = 0;
  minSlide = 0;
  maxSlide = 0;
  elementIndex = 0;

  @ViewChild('tab') tab: ElementRef | undefined;
  @ViewChild('logoContainer') logoContainer: ElementRef | undefined;

  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}
  ngAfterViewInit() {
    if (!this.logoContainer) return;

    this.hiddenTextElements = [
      ...this.logoContainer.nativeElement.querySelectorAll('.hidden-text'),
    ];
    if (this.tab && this.logoContainer) {
      this.letterWidths = this.hiddenTextElements.map(
        (element) => element.scrollWidth + 4
      );
    }
    this.maxTravel = this.letterWidths.reduce((a, b) => a + b, 0);
    this.minSlide =
      this.logoContainer.nativeElement.getBoundingClientRect().width;
    this.maxSlide = this.minSlide + this.maxTravel;
  }
  @HostBinding('class') get classes() {
    return ` mx-auto`;
  }

  handleDistanceTraveled(amount: number) {
    this.updateHiddenTextWidth(amount);
    this.totalTravel = amount;
  }

  handleIndexChange(amount: number): number {
    const travelPercentage = amount / this.maxTravel;
    const letterPercentages = this.letterWidths.map(
      (width) => width / this.maxTravel
    );
    if (travelPercentage < letterPercentages[0]) {
      return 0;
    }
    if (travelPercentage < letterPercentages[0] + letterPercentages[1]) {
      return 1;
    }
    return 2;
  }

  updateHiddenTextWidth(amount: number) {
    if (!this.logoContainer) return;
    this.zone.runOutsideAngular(() => {
      const currentIndex = this.handleIndexChange(amount);
      this.hiddenTextElements.forEach((element, index) => {
        if (index < currentIndex) {
          element.style.width = this.letterWidths[index] + 'px';
        } else if (index === currentIndex) {
          element.style.width =
            amount - this.getTravelBeforeIndex(index) + 'px';
        } else {
          element.style.width = '0px';
        }
      });
    });
  }
  getTravelBeforeIndex(index: number): number {
    return this.letterWidths.slice(0, index).reduce((a, b) => a + b, 0);
  }
}
