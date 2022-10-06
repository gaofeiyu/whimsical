import { describe, test, expect, beforeEach } from 'vitest';
import StateManagement from '../StateManagement';

type StateType = {
  key: number;
};

describe('StateManagement', () => {
  let State: StateManagement<StateType>;
  beforeEach(() => {
    State = new StateManagement<StateType>({
      state: {
        key: 0,
      },
    });
    expect(State.getStateOfRaw().key).toBe(0);
  });

  test('state & getState', () => {
    const state = State.getState();
    expect(state.key).toBe(0);
    State.setState({
      key: 1,
    });
    expect(State.getState()).toBe(state);
    state.key = state.key + 1;
    expect(State.getStateOfRaw().key).toBe(2);
    expect(state.key).toBe(2);
  });

  test('state & getStateOfRaw', () => {
    const stateRaw = State.getStateOfRaw();
    stateRaw.key = stateRaw.key + 1;
    expect(State.getState().key).toBe(0);
    expect(stateRaw.key).toBe(1);
  });
});
