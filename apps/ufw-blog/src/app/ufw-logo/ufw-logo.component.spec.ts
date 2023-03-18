import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UfwLogoComponent } from './ufw-logo.component';

describe('UfwLogoComponent', () => {
  let component: UfwLogoComponent;
  let fixture: ComponentFixture<UfwLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UfwLogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UfwLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change the currentElement when the amount treveled is greater than the current element width', () => {
    const currentElement = component.currentElement;
    const letterWidths = Reflect.get(component, 'letterWidths');
    const firstWidth = letterWidths[0];

    Reflect.set(component, 'amountTraveled', [200, 0, 0]);
    console.log(
      firstWidth,
      currentElement.classList[0],
      component.currentElement.classList[0]
    );
    expect(component.currentElement).not.toBe(currentElement);
  });
});
