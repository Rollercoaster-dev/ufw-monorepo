import {
  Component,
  ElementRef,
  NgZone,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggingDirective } from '../dragging/dragging.directive';

@Component({
  selector: 'ufw-l-logo',
  standalone: true,
  imports: [CommonModule, DraggingDirective],
  template: `
    <div class="flex">
      <div class="logo-container flex items-center select-none" #logoContainer>
        <div class="U text-4xl font-bold">U</div>
        <div class="Utterly hidden-text text-3xl font-bold">tterly</div>
        <div class="F text-4xl font-bold">F</div>
        <div class="Fucking hidden-text text-3xl font-bold">ucking</div>
        <div class="W text-4xl font-bold">W</div>
        <div class="Wonderful hidden-text text-3xl font-bold">onderful</div>
      </div>
      <div
        class="tab"
        #tab
        ufwLDragging
        [min]="minSlide - 4"
        [max]="maxSlide + 20"
        [style]="{ width: maxSlide + 20 }"
        position="absolute"
        [absolutePosition]="{
          x: logoContainer.getBoundingClientRect().width - 10,
          y: 8
        }"
        (distanceTraveled)="handleDistanceTraveled($event)"
      >
        <div class="inner-tab"></div>
      </div>
    </div>
  `,
  styleUrls: ['./ufw-logo.component.scss'],
})
export class UfwLogoComponent implements AfterViewInit {
  private hiddenTextElements: HTMLElement[] = [];
  private letterWidths = [0, 0, 0];

  totalTravel = 0;
  maxTravel = 0;
  minSlide = 0;
  maxSlide = 0;
  #elementIndex = 0;
  set elementIndex(value: number) {
    this.#elementIndex = value;
  }
  get elementIndex() {
    return this.#elementIndex;
  }

  @ViewChild('tab') tab: ElementRef | undefined;
  @ViewChild('logoContainer') logoContainer: ElementRef | undefined;

  constructor(private zone: NgZone) {}
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
    return `w-11/12`;
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
