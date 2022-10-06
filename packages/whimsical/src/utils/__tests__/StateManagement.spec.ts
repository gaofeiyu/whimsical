import { describe, test, expect, beforeEach } from 'vitest';
import StateManagement from '../StateManagement';

type EditorStateType = {
  key: number;
};

describe('StateManagement', () => {
  let EditorState: StateManagement<EditorStateType>;
  beforeEach(() => {
    EditorState = new StateManagement<EditorStateType>({
      state: {
        key: 0,
      },
    });
    expect(EditorState.getStateOfRaw().key).toBe(0);
  });

  test('state & getState', () => {
    const state = EditorState.getState();
    expect(state.key).toBe(0);
    EditorState.setState({
      key: 1,
    });
    expect(EditorState.getState()).toBe(state);
    state.key = state.key + 1;
    expect(EditorState.getStateOfRaw().key).toBe(2);
  });

  test('state & getStateOfRaw', () => {
    const stateRaw = EditorState.getStateOfRaw();
    stateRaw.key = stateRaw.key + 1;
    expect(EditorState.getState().key).toBe(0);
  });
});
