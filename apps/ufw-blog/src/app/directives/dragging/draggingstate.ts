import { OnDestroy, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';

export class DraggingState {
  constructor() {}
  dragId!: string | null;
  min = 0;
  max = Infinity;
  adjustMaxBy = 0;

  private draggingSubject = new BehaviorSubject<boolean>(false);
  get dragging() {
    return this.draggingSubject.value;
  }
  set dragging(value: boolean) {
    this.draggingSubject.next(value);
  }
  dragging$ = this.draggingSubject.asObservable();

  private distanceTraveledSubject = new BehaviorSubject<number>(0);
  get distanceTraveled() {
    return this.distanceTraveledSubject.value;
  }
  set distanceTraveled(value: number) {
    this.distanceTraveledSubject.next(value);
  }
  distanceTraveled$ = this.distanceTraveledSubject.asObservable();
  isMaxReached$: Observable<boolean> = this.distanceTraveled$.pipe(
    map((distanceTraveled) => {
      return distanceTraveled >= this.max + this.adjustMaxBy;
    })
  );

  private dragStartSubject = new BehaviorSubject<boolean>(false);
  get dragStart() {
    return this.dragStartSubject.value;
  }
  set dragStart(value: boolean) {
    this.dragStartSubject.next(value);
  }
  dragStart$ = this.dragStartSubject.asObservable();

  private dragEndSubject = new BehaviorSubject<boolean>(false);
  get dragEnd() {
    return this.dragEndSubject.value;
  }
  set dragEnd(value: boolean) {
    this.dragEndSubject.next(value);
  }
  dragEnd$ = this.dragEndSubject.asObservable();

  private allowReturnHomeSubject = new BehaviorSubject<boolean>(true);
  get allowReturnHome() {
    return this.allowReturnHomeSubject.value;
  }
  set allowReturnHome(value: boolean) {
    this.allowReturnHomeSubject.next(value);
  }
  allowReturnHome$ = this.allowReturnHomeSubject.asObservable();

  private returningHomeSubject = new BehaviorSubject<boolean>(false);
  get returningHome() {
    return this.returningHomeSubject.value;
  }
  set returningHome(value: boolean) {
    this.returningHomeSubject.next(value);
  }
  returningHome$ = this.returningHomeSubject.asObservable();

  private arrivedHomeSubject = new BehaviorSubject<boolean>(false);
  get arrivedHome() {
    return this.arrivedHomeSubject.value;
  }
  set arrivedHome(value: boolean) {
    this.arrivedHomeSubject.next(value);
  }
  arrivedHome$ = this.arrivedHomeSubject.asObservable();

  adjustMaxForIsMaxReached(adjustment: number) {
    this.adjustMaxBy += adjustment;
  }
}
