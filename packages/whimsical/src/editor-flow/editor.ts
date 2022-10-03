import EventManagement from '../../src/utils/EventManagement';
import HistoryManagement from '../../src/utils/HistoryManagement';

export const EDITOR_EVENTS$ = new EventManagement();

EDITOR_EVENTS$.createEvent('triggerButton1');
EDITOR_EVENTS$.createEvent('triggerButton2');
EDITOR_EVENTS$.createEvent('triggerStateChange');

export const EDITOR_HISTORY = new HistoryManagement({
  eventInstance: EDITOR_EVENTS$,
});
