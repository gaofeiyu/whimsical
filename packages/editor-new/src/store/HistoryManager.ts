import { makeAutoObservable } from 'mobx';

export interface HistorySnapshot {
  timestamp: number;
  name?: string;
  data: string; // The serialized JSON string of the DSL
}

export class HistoryManager {
  past: HistorySnapshot[] = [];
  future: HistorySnapshot[] = [];

  // Snapshots created explicitly (e.g. by a user or Chatbot)
  namedSnapshots: HistorySnapshot[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Push a new state to the history
  push(stateData: string, name?: string) {
    const snapshot: HistorySnapshot = {
      timestamp: Date.now(),
      name,
      data: stateData
    };

    // Once a new action is performed, future is cleared
    this.future = [];
    this.past.push(snapshot);
  }

  saveNamedSnapshot(stateData: string, name: string) {
    this.namedSnapshots.push({
      timestamp: Date.now(),
      name,
      data: stateData
    });
  }

  canUndo(): boolean {
    return this.past.length > 0;
  }

  canRedo(): boolean {
    return this.future.length > 0;
  }

  // Returns the previous state data, or null if nothing to undo
  undo(currentStateData: string): string | null {
    if (this.past.length === 0) return null;

    const previousState = this.past.pop()!;
    this.future.push({
      timestamp: Date.now(),
      data: currentStateData
    });

    return previousState.data;
  }

  // Returns the next state data, or null if nothing to redo
  redo(currentStateData: string): string | null {
    if (this.future.length === 0) return null;

    const nextState = this.future.pop()!;
    this.past.push({
      timestamp: Date.now(),
      data: currentStateData
    });

    return nextState.data;
  }
}

export const globalHistory = new HistoryManager();
