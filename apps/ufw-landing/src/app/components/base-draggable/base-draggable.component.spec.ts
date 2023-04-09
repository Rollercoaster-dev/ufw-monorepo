import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDraggableComponent } from './base-draggable.component';

describe('BaseDraggableComponent', () => {
  let component: BaseDraggableComponent;
  let fixture: ComponentFixture<BaseDraggableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseDraggableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseDraggableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
