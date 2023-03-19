import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedTextComponent } from './led-text.component';

describe('LedTextComponent', () => {
  let component: LedTextComponent;
  let fixture: ComponentFixture<LedTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LedTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
