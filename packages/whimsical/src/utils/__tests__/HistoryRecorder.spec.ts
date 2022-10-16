import { describe, test, expect, beforeEach } from 'vitest';
import EventManagement from '../EventManagement';
import StateManagement from '../StateManagement';
import HistoryRecorder from '../HistoryRecorder';
import { Blob } from 'buffer';
// https://github.com/vitest-dev/vitest/issues/1377
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.Blob = Blob as any;

type StateType = {
  key: number;
};

describe('StateManagement', () => {
  let EVENTS$: EventManagement;
  let HistoryInstance: HistoryRecorder;
  let State: StateManagement<StateType>;
  const eventName = 'testEvent';
  beforeEach(() => {
    const stateMock = {
      key: 0,
    };
    State = new StateManagement<StateType>(stateMock);
    EVENTS$ = new EventManagement();
    EVENTS$.createEvent(eventName);
    HistoryInstance = new HistoryRecorder({
      eventInstance: EVENTS$,
    });
    HistoryInstance.registerStore(State);
  });

  test('Base', () =>
    new Promise((done) => {
      EVENTS$.emit(eventName);
      const recordItemFirst = HistoryInstance.getRecord()[0];
      HistoryInstance.onChange(() => {
        done(null);
      });
      expect(recordItemFirst.eventName).toBe(eventName);
      expect(recordItemFirst.stateSnapshot[0]).toEqual(State.serialize());
      State.from({
        key: 1,
      });
      EVENTS$.emit(eventName);
      const recordItemSecond = HistoryInstance.getRecord()[1];
      expect(recordItemSecond.stateSnapshot[0]).toEqual(State.serialize());
      HistoryInstance.goto(0);
      expect(recordItemFirst.executed).toBe(true);
      expect(recordItemSecond.executed).toBe(false);
    }));
});
