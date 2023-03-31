import { TestBed } from '@angular/core/testing';

import { Switch, SwitchConnectorService } from './switch-connector.service';

describe('SwitchConnectorService', () => {
  let service: SwitchConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwitchConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new switch and be retrievable', () => {
    const newSwitch: Switch = {
      id: 'switch1',
      active: false,
    };

    service.addSwitch(newSwitch);
    expect(service.getSwitch('switch1')).toEqual(newSwitch);
  });

  it('should remove a switch', () => {
    const switch1: Switch = {
      id: 'switch1',
      active: false,
    };

    const switch2: Switch = {
      id: 'switch2',
      active: false,
    };

    service.addSwitch(switch1);
    service.addSwitch(switch2);

    service.removeSwitch('switch1');

    expect(service.getSwitch('switch1')).toBeUndefined();
    expect(service.getSwitch('switch2')).toEqual(switch2);
  });

  it('should correctly check dependencies', () => {
    const switch1: Switch = {
      id: 'switch1',
      active: false,
    };

    const switch2: Switch = {
      id: 'switch2',
      active: false,
      dependencies: [
        {
          id: 'switch1',
          condition: 'mustBeActive',
        },
      ],
    };

    service.addSwitch(switch1);
    service.addSwitch(switch2);

    expect(service.checkDependencies('switch2')).toBe(false);

    service.activateSwitch('switch1');

    expect(service.checkDependencies('switch2')).toBe(true);
  });

  it('should toggle the switch correctly based on dependencies', () => {
    const switch1: Switch = {
      id: 'switch1',
      active: false,
    };

    const switch2: Switch = {
      id: 'switch2',
      active: false,
      dependencies: [
        {
          id: 'switch1',
          condition: 'mustBeActive',
        },
      ],
    };

    service.addSwitch(switch1);
    service.addSwitch(switch2);

    service.toggleSwitch('switch2');
    expect(service.getSwitch('switch2').active).toBe(false);

    service.toggleSwitch('switch1');
    expect(service.getSwitch('switch1').active).toBe(true);

    service.toggleSwitch('switch2');
    expect(service.getSwitch('switch2').active).toBe(true);
  });
});
