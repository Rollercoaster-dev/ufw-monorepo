import { Injectable } from '@angular/core';
import { DraggingState } from './draggingstate';

export interface DraggingStateDictionary {
  [id: string]: DraggingState;
}

@Injectable({
  providedIn: 'root',
})
export class DraggableStateManager {
  private draggingInstances: DraggingStateDictionary = {};

  createDraggingInstance(id: string, state: DraggingState): DraggingState {
    if (this.draggingInstances[id]) {
      throw new Error(`Dragging instance with id '${id}' already exists.`);
    }

    this.draggingInstances[id] = state;
    return state;
  }

  hasDraggingInstance(id: string): boolean {
    return !!this.draggingInstances[id];
  }

  setDraggingInstance(id: string, dragging: DraggingState): void {
    const instance = this.draggingInstances[id];
    if (!instance) {
      throw new Error(`Dragging instance with id '${id}' does not exist.`);
    }
    this.draggingInstances[id] = dragging;
  }

  getState(id: string): DraggingState {
    const instance = this.draggingInstances[id];
    if (!instance) {
      throw new Error(`Dragging instance with id '${id}' does not exist.`);
    }
    return instance;
  }

  deleteDraggingInstance(id: string): void {
    delete this.draggingInstances[id];
  }
}
