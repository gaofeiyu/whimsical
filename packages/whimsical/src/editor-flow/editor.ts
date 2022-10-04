import StateManagement from '../store/StateManagement';
import EventManagement from '../../src/utils/EventManagement';
import HistoryRecorder from '../utils/HistoryRecorder';

export const EDITOR_EVENTS$ = new EventManagement();

EDITOR_EVENTS$.createEvent('triggerButton1');
EDITOR_EVENTS$.createEvent('triggerButton2');
EDITOR_EVENTS$.createEvent('triggerStateChange');

export const EDITOR_STATE = new StateManagement();

export const EDITOR_HISTORY = new HistoryRecorder({
  eventInstance: EDITOR_EVENTS$,
  storeInstance: EDITOR_STATE,
});
