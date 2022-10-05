import { describe, test, expect, beforeEach } from 'vitest';
import EventManagement from '../EventManagement';

describe('EventManagement', () => {
  let EVENTS$: EventManagement;
  const eventName = 'testEvent';
  beforeEach(() => {
    EVENTS$ = new EventManagement();
  });

  test('Normal', () =>
    new Promise((done) => {
      const testEvent = EVENTS$.createEvent(eventName);
      expect(EVENTS$.getEvents().get(eventName)).toBe(testEvent);
      const remove1 = EVENTS$.on(eventName, () => {
        remove1();
        expect(EVENTS$.getEvent(eventName).observers.length).toBe(1);
      });
      const remove2 = EVENTS$.on(eventName, () => {
        remove2();
        expect(EVENTS$.getEvent(eventName).observers.length).toBe(0);
        done(null);
      });
      EVENTS$.emit(eventName);
    }));

  test('No event declared in loose mode', () => {
    EVENTS$.staticMode = false;
    expect(EVENTS$.checkEventName(eventName)).toBe(false);
  });

  test('No event declared in static mode', () => {
    const errorMsg = `Event Management hasn't "${eventName}" event`;
    expect(() => {
      EVENTS$.checkEventName(eventName);
    }).toThrow(errorMsg);
    expect(() => {
      EVENTS$.emit(eventName);
    }).toThrow(errorMsg);
    expect(() => {
      const remove = EVENTS$.on(eventName, () => {
        remove();
        throw Error('Wrong away!');
      });
    }).toThrow(errorMsg);
  });
});
