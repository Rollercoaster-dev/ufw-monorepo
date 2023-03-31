import { TestBed } from '@angular/core/testing';

import { Led, LedService } from './led.service';

describe('LedTextService', () => {
  let service: LedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add, retrieve, and remove a LED text object', () => {
    const newLed: Led = {
      id: 'led1',
      isOn: false,
      brightness: 0,
    };

    service.addLed(newLed);
    expect(service.getLed('led1')).toEqual(newLed);

    service.removeLed('led1');
    expect(service.getLed('led1')).toBeUndefined();
  });

  it('should toggle the LED text object state', () => {
    const led: Led = {
      id: 'led1',
      isOn: false,
      brightness: 0,
    };

    service.addLed(led);

    service.toggleLed('led1');
    expect(service.getLed('led1').isOn).toBe(true);

    service.toggleLed('led1');
    expect(service.getLed('led1').isOn).toBe(false);
  });

  it('should manage the LED text object brightness', () => {
    const led: Led = {
      id: 'led1',
      isOn: false,
      brightness: 0,
    };

    service.addLed(led);

    service.setBrightness('led1', 5);
    expect(service.getBrightness('led1')).toBe(5);

    service.increaseBrightness('led1');
    expect(service.getBrightness('led1')).toBe(6);

    service.decreaseBrightness('led1');
    expect(service.getBrightness('led1')).toBe(5);

    service.resetBrightness('led1');
    expect(service.getBrightness('led1')).toBe(0);
  });
});
