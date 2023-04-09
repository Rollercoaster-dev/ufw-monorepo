import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Led {
  id: string;
  isOn: boolean;
  brightness: number;
}

export interface LedState {
  [key: string]: Led;
}

const initialState: LedState = {};

@Injectable({
  providedIn: 'root',
})
export class LedService {
  private leds = new BehaviorSubject<LedState>(initialState);
  leds$ = this.leds.asObservable();

  generateId() {
    return Math.random().toString(36).substring(2);
  }

  createNewLed(id: string): Led {
    return {
      id,
      isOn: false,
      brightness: 0,
    };
  }

  addLed(newLedId: string) {
    if (!this.leds.value[newLedId]) {
      this.leds.next({
        ...this.leds.value,
        [newLedId]: this.createNewLed(newLedId),
      });
    }
  }

  removeLed(ledId: string) {
    const { [ledId]: _, ...newState } = this.leds.value;
    this.leds.next(newState);
  }

  getLed(ledId: string) {
    return this.leds.value[ledId];
  }

  setLed(ledId: string, newLed: Led) {
    this.leds.next({ ...this.leds.value, [ledId]: newLed });
  }

  setLedState(ledId: string, isOn: boolean) {
    const led = this.getLed(ledId);
    if (led) {
      this.setLed(ledId, { ...led, isOn });
    }
  }

  toggleLed(ledId: string) {
    const led = this.getLed(ledId);
    if (led) {
      this.setLed(ledId, { ...led, isOn: !led.isOn });
    }
  }

  setBrightness(ledId: string, brightness: number) {
    const led = this.getLed(ledId);
    if (led) {
      this.setLed(ledId, { ...led, brightness });
    }
  }

  increaseBrightness(ledId: string) {
    const led = this.getLed(ledId);
    if (led) {
      this.setLed(ledId, { ...led, brightness: led.brightness + 1 });
    }
  }

  decreaseBrightness(ledId: string) {
    const led = this.getLed(ledId);
    if (led) {
      this.setLed(ledId, { ...led, brightness: led.brightness - 1 });
    }
  }

  resetBrightness(ledId: string) {
    const led = this.getLed(ledId);
    if (led) {
      this.setLed(ledId, { ...led, brightness: 0 });
    }
  }

  getBrightness(ledId: string): number | undefined {
    const led = this.getLed(ledId);
    if (led) {
      return led.brightness;
    }
    return;
  }

  getIsOn(ledId: string): boolean | undefined {
    const led = this.getLed(ledId);
    if (led) {
      return led.isOn;
    }
    return;
  }

  getLeds() {
    return this.leds.value;
  }
}
