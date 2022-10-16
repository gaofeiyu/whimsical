import { describe, test, expect, beforeEach } from 'vitest';
import StateManagement from '../StateManagement';

type StateType = {
  key: number;
};

describe('StateManagement', () => {
  let State: StateManagement<StateType>;
  beforeEach(() => {
    State = new StateManagement<StateType>({
      key: 0,
    });
    expect(State.serialize().key).toBe(0);
  });

  test('state & getState', () => {
    const state = State.state;
    expect(state.key).toBe(0);
    State.from({
      key: 1,
    });
    expect(State.state).toBe(state);
    state.key = state.key + 1;
    expect(State.serialize().key).toBe(2);
    expect(state.key).toBe(2);
  });

  test('state & serialize', () => {
    const stateRaw = State.serialize();
    stateRaw.key = stateRaw.key + 1;
    expect(State.state.key).toBe(0);
    expect(stateRaw.key).toBe(1);
  });
});
