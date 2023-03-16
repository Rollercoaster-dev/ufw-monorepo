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
});
