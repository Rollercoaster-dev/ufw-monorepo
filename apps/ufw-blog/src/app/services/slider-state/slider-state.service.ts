import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SliderState {
  id: string;
  axis: 'x' | 'y';
  min: number;
  max: number;
  lockToPosition: boolean;
  position: 'relative' | 'absolute';
  absolutePosition: { x: number; y: number };
  returnHomeDuration?: number;
  returnHomeDelay: number;
  allowReturnHome: boolean;
  dragging: boolean;
  initialPosition: { x: number; y: number };
  initialMousePosition: { x: number; y: number };
  distanceTraveled: number;
  minValue: number;
  maxValue: number;
  currentValue?: number;
}

export interface SlidersState {
  [key: string]: SliderState;
}

const initialState: SlidersState = {};

@Injectable({
  providedIn: 'root',
})
export class SliderStateService {
  private sliders = new BehaviorSubject<SlidersState>(initialState);
  sliders$ = this.sliders.asObservable();

  generateId() {
    return Math.random().toString(36).substring(2);
  }

  createNewSlider(id: string): SliderState {
    return {
      id,
      axis: 'x',
      min: 0,
      max: Infinity,
      lockToPosition: false,
      position: 'relative',
      absolutePosition: { x: 0, y: 0 },
      returnHomeDuration: undefined,
      returnHomeDelay: 0,
      allowReturnHome: true,
      dragging: false,
      initialPosition: { x: 0, y: 0 },
      initialMousePosition: { x: 0, y: 0 },
      distanceTraveled: 0,
      minValue: 0,
      maxValue: Infinity,
    };
  }

  addSlider(newSliderId: string) {
    if (!this.sliders.value[newSliderId]) {
      this.sliders.next({
        ...this.sliders.value,
        [newSliderId]: this.createNewSlider(newSliderId),
      });
    }
  }

  removeSlider(sliderId: string) {
    const { [sliderId]: _, ...newState } = this.sliders.value;
    this.sliders.next(newState);
  }

  getSlider(sliderId: string) {
    return this.sliders.value[sliderId];
  }

  setSlider(sliderId: string, newSlider: SliderState) {
    this.sliders.next({ ...this.sliders.value, [sliderId]: newSlider });
  }

  updateSliderProperty(sliderId: string, key: keyof SliderState, value: any) {
    const slider = this.getSlider(sliderId);
    if (slider) {
      this.setSlider(sliderId, { ...slider, [key]: value });
    }
  }
  updateSliderState(sliderId: string, newState: Partial<SliderState>) {
    const slider = this.getSlider(sliderId);
    if (slider) {
      this.setSlider(sliderId, { ...slider, ...newState });
    }
  }

  getSliders() {
    return this.sliders.value;
  }
}
