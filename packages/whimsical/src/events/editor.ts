import EventManagement from '../../src/utils/EventManagement';
import HistoryManagement from '../../src/utils/HistoryManagement';

const EDITOR_EVENTS$ = new EventManagement();

EDITOR_EVENTS$.createEvent('triggerButton');

export const EDITOR_HISTORY = new HistoryManagement({
  eventInstance: EDITOR_EVENTS$,
});

export default EDITOR_EVENTS$;
