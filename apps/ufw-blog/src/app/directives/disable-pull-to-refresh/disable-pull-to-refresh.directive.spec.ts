// disable-pull-to-refresh.directive.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DisablePullToRefreshDirective } from './disable-pull-to-refresh.directive';

@Component({
  template: `<div appDisablePullToRefresh></div>`,
  standalone: true,
})
class TestComponent {}

describe('DisablePullToRefreshDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [DisablePullToRefreshDirective],
      declarations: [DisablePullToRefreshDirective],
    });

    fixture = TestBed.createComponent(TestComponent);
    directiveElement = fixture.debugElement.query(
      By.directive(DisablePullToRefreshDirective)
    );
  });

  it('should create the directive', () => {
    expect(directiveElement).toBeTruthy();
  });

  it('should call preventDefault on touchmove when pageYOffset is 0 and touchYDelta is positive', () => {
    const directiveInstance = directiveElement.injector.get(
      DisablePullToRefreshDirective
    );
    const touchstartHandler = spyOn(
      directiveInstance as any,
      'disablePullToRefresh'
    ).and.callThrough();
    const touchmoveHandler = spyOn(
      directiveInstance as any,
      'disablePullToRefresh'
    ).and.callThrough();
    const preventDefaultSpy = jasmine.createSpy('preventDefault');

    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });

    touchstartHandler({ touches: [{ clientY: 50 }] });
    touchmoveHandler({
      touches: [{ clientY: 100 }],
      preventDefault: preventDefaultSpy,
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should not call preventDefault on touchmove when pageYOffset is not 0 or touchYDelta is not positive', () => {
    const directiveInstance = directiveElement.injector.get(
      DisablePullToRefreshDirective
    );
    const touchstartHandler = spyOn(
      directiveInstance as any,
      'disablePullToRefresh'
    ).and.callThrough();
    const touchmoveHandler = spyOn(
      directiveInstance as any,
      'disablePullToRefresh'
    ).and.callThrough();
    const preventDefaultSpy = jasmine.createSpy('preventDefault');

    Object.defineProperty(window, 'pageYOffset', { value: 50, writable: true });

    touchstartHandler({ touches: [{ clientY: 50 }] });
    touchmoveHandler({
      touches: [{ clientY: 30 }],
      preventDefault: preventDefaultSpy,
    });

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});
