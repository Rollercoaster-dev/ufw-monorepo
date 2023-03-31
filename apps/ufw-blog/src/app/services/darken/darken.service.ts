import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkenService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable();
  get isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }
  set isDarkMode(value: boolean) {
    this.isDarkModeSubject.next(value);
  }

  private opacityValueSubject = new BehaviorSubject<number>(100);
  opacityValue$ = this.opacityValueSubject.asObservable();
  get opacityValue(): number {
    return this.opacityValueSubject.value;
  }
  set opacityValue(value: number) {
    this.opacityValueSubject.next(value);
  }
  style$: Observable<any> = combineLatest([
    this.isDarkMode$,
    this.opacityValue$,
  ]).pipe(
    map(([isDarkMode, opacityValue]) => {
      if (isDarkMode) {
        document.documentElement.style.setProperty(
          'background-color',
          `rgba(15, 19, 35, ${opacityValue / 100})`
        );
      } else {
        document.documentElement.style.setProperty('background-color', 'white');
      }
    })
  );

  constructor() {
    this.style$.subscribe();
  }
  setDarkNoOpacity(): void {
    this.isDarkMode = true;
    this.opacityValue = 0;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.style.setProperty(
        'background-color',
        `rgba(15, 19, 35, ${this.opacityValue / 10})`
      );
    } else {
      document.documentElement.style.setProperty('background-color', 'white');
    }
  }

  get backgroundColor(): string {
    return this.isDarkMode
      ? `rgba(15, 19, 35, ${this.opacityValue / 10}`
      : `white`;
  }

  getTextColor(): string {
    return this.isDarkMode ? 'text-white' : 'text-gray-800';
  }
  mapToRange(
    value: number,
    fromRange: [number, number],
    toRange: [number, number] = [0, 100]
  ): number {
    const [fromMin, fromMax] = fromRange;
    const [toMin, toMax] = toRange;
    const scale = (toMax - toMin) / (fromMax - fromMin);
    return Math.round(toMin + (value - fromMin) * scale);
  }
}
