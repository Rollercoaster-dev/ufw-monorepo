import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DraggingDirective } from './dragging.directive';

@Component({
  template: `<div ufwLDragging></div>`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
  standalone: true,
  imports: [DraggingDirective],
})
class TestComponent {}

describe('DraggingDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // declarations: [],
      imports: [TestComponent, DraggingDirective],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should track the correct distance traveled', () => {
    const draggableDiv = fixture.nativeElement.querySelector('div');
    const directiveInstance =
      fixture.debugElement.children[0].injector.get(DraggingDirective);

    let distanceTraveled = 0;
    directiveInstance.distanceTraveled.subscribe((distance: number) => {
      distanceTraveled = distance;
    });

    // Simulate a mousedown event
    draggableDiv.dispatchEvent(
      new MouseEvent('mousedown', { clientX: 10, clientY: 100 })
    );

    // Simulate a mousemove event
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 150, clientY: 150 })
    );

    // Simulate a mouseup event
    document.dispatchEvent(new MouseEvent('mouseup'));

    // Check if the distance traveled is correct
    expect(distanceTraveled).toBe(140);
  });
  it('should track the correct distance traveled along the Y-axis', () => {
    const draggableDiv = fixture.nativeElement.querySelector('div');
    const directiveInstance =
      fixture.debugElement.children[0].injector.get(DraggingDirective);

    directiveInstance.axis = 'y';

    let distanceTraveled = 0;
    directiveInstance.distanceTraveled.subscribe((distance: number) => {
      distanceTraveled = distance;
    });

    draggableDiv.dispatchEvent(
      new MouseEvent('mousedown', { clientX: 100, clientY: 100 })
    );
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 100, clientY: 200 })
    );
    document.dispatchEvent(new MouseEvent('mouseup'));

    expect(distanceTraveled).toBe(100);
  });

  it('should respect min and max values', () => {
    const draggableDiv = fixture.nativeElement.querySelector('div');
    const directiveInstance =
      fixture.debugElement.children[0].injector.get(DraggingDirective);

    directiveInstance.min = 20;
    directiveInstance.max = 60;

    let distanceTraveled = 0;
    directiveInstance.distanceTraveled.subscribe((distance: number) => {
      distanceTraveled = distance;
    });

    draggableDiv.dispatchEvent(
      new MouseEvent('mousedown', { clientX: 100, clientY: 100 })
    );
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 110, clientY: 110 })
    );
    document.dispatchEvent(new MouseEvent('mouseup'));

    expect(distanceTraveled).toBe(20);

    draggableDiv.dispatchEvent(
      new MouseEvent('mousedown', { clientX: 100, clientY: 100 })
    );
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 170, clientY: 170 })
    );
    document.dispatchEvent(new MouseEvent('mouseup'));

    expect(distanceTraveled).toBe(60);
  });
});
