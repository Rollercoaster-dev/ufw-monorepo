import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkenService {
  private opacity = new BehaviorSubject<number>(0);
  opacity$ = this.opacity.asObservable();
  private readonly opacityStep = 0.1;

  increaseOpacity() {
    this.opacity.next(this.opacity.value + this.opacityStep);
  }
  decreaseOpacity() {
    this.opacity.next(this.opacity.value - this.opacityStep);
  }

  resetOpacity() {
    this.opacity.next(0);
  }

  getOpacity() {
    return this.opacity.value;
  }
}
