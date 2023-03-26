import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Switch {
  id: string;
  active: boolean;
  value?: number;
  dependencies?: Dependency[];
}

export interface Dependency {
  id: string; // The ID of the connected switch
  condition: DependencyCondition; // The condition required for activation
}

export type DependencyCondition = 'mustBeActive' | 'mustBeInactive';

export interface SwitchState {
  [key: string]: Switch;
}

const initialState: SwitchState = {};

@Injectable({
  providedIn: 'root',
})
export class SwitchConnectorService {
  private switches = new BehaviorSubject<SwitchState>(initialState);
  switches$ = this.switches.asObservable();

  addSwitch(newSwitch: Switch) {
    this.switches.next({ ...this.switches.value, [newSwitch.id]: newSwitch });
  }

  removeSwitch(switchId: string) {
    const { [switchId]: _, ...newState } = this.switches.value;
    this.switches.next(newState);
  }

  getSwitch(switchId: string) {
    return this.switches.value[switchId];
  }

  setSwitch(switchId: string, newSwitch: Switch) {
    this.switches.next({ ...this.switches.value, [switchId]: newSwitch });
  }

  checkDependencies(switchId: string) {
    const switchToCheck = this.getSwitch(switchId);
    if (switchToCheck && switchToCheck.dependencies) {
      return switchToCheck.dependencies.reduce((accumulator, dependency) => {
        const connectedSwitch = this.getSwitch(dependency.id);
        if (connectedSwitch) {
          const conditionMet =
            dependency.condition === 'mustBeActive'
              ? connectedSwitch.active
              : dependency.condition === 'mustBeInactive'
              ? !connectedSwitch.active
              : true;
          return accumulator && conditionMet;
        }
        return false;
      }, true);
    }
    return true;
  }

  activateSwitch(switchId: string) {
    const dependenciesMet = this.checkDependencies(switchId);
    if (dependenciesMet) {
      this.setSwitch(switchId, { ...this.getSwitch(switchId), active: true });
    }
  }

  deactivateSwitch(switchId: string) {
    this.setSwitch(switchId, { ...this.getSwitch(switchId), active: false });
  }

  toggleSwitch(switchId: string) {
    const dependenciesMet = this.checkDependencies(switchId);
    const switchToToggle = this.getSwitch(switchId);
    if (switchToToggle) {
      this.setSwitch(switchId, {
        ...switchToToggle,
        active: dependenciesMet && !switchToToggle.active,
      });
    }
  }
}

/**
 * Switch state management: The service should manage the state of all switches, including activation and connections. You could use a dictionary or a Map to store the state of each switch based on its unique identifier.
Switch activation: The service should expose methods to activate or deactivate a switch. It should enforce the rules for connected switches, such that switch 2 can only be activated if switch 1 is already active.
Switch connections: The service should provide methods to establish or remove connections between switches. It should also allow the retrieval of connected switches for a specific switch.
Optional value property: Since the value property is optional, you should consider how the service will handle switches without a value. You could provide a default value, or ensure the service can handle cases where a switch does not have a value.
ConnectedTo property: The connectedTo property allows connections to a single switch or multiple switches. You should ensure the service can handle both cases. Additionally, you could consider using an array for all cases (even for a single connection) to simplify the implementation and improve code consistency.
Cycles and complex connections: When managing connections, you should ensure the service can handle cycles or more complex connection scenarios. For example, you might have a situation where switch A connects to switch B, and switch B connects back to switch A. The service should prevent or handle such cases, depending on the desired behavior.
 */
