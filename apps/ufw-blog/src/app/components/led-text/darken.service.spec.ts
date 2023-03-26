import { TestBed } from '@angular/core/testing';
import { DarkenService } from './darken.service';

describe('DarkenService', () => {
  let service: DarkenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DarkenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should increase and decrease opacity', () => {
    service.increaseOpacity();
    expect(service.getOpacity()).toBeCloseTo(0.1);

    service.increaseOpacity();
    expect(service.getOpacity()).toBeCloseTo(0.2);

    service.decreaseOpacity();
    expect(service.getOpacity()).toBeCloseTo(0.1);
  });

  it('should reset opacity to 0', () => {
    service.increaseOpacity();
    expect(service.getOpacity()).toBeCloseTo(0.1);

    service.resetOpacity();
    expect(service.getOpacity()).toBeCloseTo(0);
  });
});
