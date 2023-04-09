import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LedService } from './led.service';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'ufw-l-led-text',
  standalone: true,
  imports: [CommonModule],
  template: ` <div
    [id]="ledId"
    class="text-ufw-light-300 text-3xl p-3 led"
    [ngClass]="{ show: lightLed, glow: lightLed }"
  >
    <ng-content></ng-content>
  </div>`,
  styleUrls: ['./led-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedTextComponent implements OnDestroy, OnInit {
  #ledService = inject(LedService);
  #cd = inject(ChangeDetectorRef);
  #ledSubscription!: Subscription;

  @Input()
  set lightLed(value: boolean) {
    console.log('lightLed', value);
    this._lightLed = value;
    this.lightLed$.next(value);
  }
  get lightLed(): boolean {
    return this._lightLed;
  }
  private _lightLed = false;
  private lightLed$ = new BehaviorSubject<boolean>(this._lightLed);

  @Input() ledId: string = this.#ledService.generateId();

  ngOnInit() {
    this.#ledService.addLed(this.ledId);

    // Create an observable for the lightLed input changes
    const lightLed$ = new BehaviorSubject<boolean>(this.lightLed);
    lightLed$.pipe(distinctUntilChanged()).subscribe((lightLed) => {
      this.#ledService.setLedState(this.ledId, lightLed);
    });

    // Combine the input and service observables
    const combined$ = combineLatest([lightLed$, this.#ledService.leds$]).pipe(
      map(([lightLed, leds]) => {
        const led = leds[this.ledId];
        return led ? led.isOn : lightLed;
      }),
      distinctUntilChanged()
    );

    // Subscribe to the combined observable
    this.#ledSubscription = combined$.subscribe((lightLed) => {
      this.lightLed = lightLed;
      this.#cd.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.#ledSubscription) this.#ledSubscription.unsubscribe();
  }
}
