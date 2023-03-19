import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullTabComponent } from './pull-tab.component';

describe('PullTabComponent', () => {
  let component: PullTabComponent;
  let fixture: ComponentFixture<PullTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PullTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PullTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
