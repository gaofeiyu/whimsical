import StateManagement from '../utils/StateManagement';
import EventManagement from 'src/utils/EventManagement';
import HistoryRecorder from '../utils/HistoryRecorder';
import WTreeNode from '../core/WNode';

export const EDITOR_EVENTS$ = new EventManagement();

EDITOR_EVENTS$.createEvent('triggerButton1');
EDITOR_EVENTS$.createEvent('triggerButton2');
EDITOR_EVENTS$.createEvent('triggerStateChange');
EDITOR_EVENTS$.createEvent('renderLayer:ready');

// node event
EDITOR_EVENTS$.createEvent('node:prepend');
EDITOR_EVENTS$.createEvent('node:append');
EDITOR_EVENTS$.createEvent('node:insertAfter');
EDITOR_EVENTS$.createEvent('node:insertBefore');
EDITOR_EVENTS$.createEvent('node:remove');

type EditorStateType = {
  key: number;
};

export const EditorState = new StateManagement<EditorStateType>({
  key: 0,
});

export const PageDSLState = new StateManagement<WTreeNode | null>(null);

export const ComponentState = new StateManagement<WTreeNode | null>(null);

export const EditorHistory = new HistoryRecorder({
  eventInstance: EDITOR_EVENTS$,
});

EditorHistory.registerStore(EditorState);
EditorHistory.registerStore(PageDSLState);
