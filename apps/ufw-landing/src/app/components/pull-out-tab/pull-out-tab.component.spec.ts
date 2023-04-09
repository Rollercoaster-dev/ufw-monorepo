import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullOutTabComponent } from './pull-out-tab.component';

describe('PullOutTabComponent', () => {
  let component: PullOutTabComponent;
  let fixture: ComponentFixture<PullOutTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PullOutTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PullOutTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
