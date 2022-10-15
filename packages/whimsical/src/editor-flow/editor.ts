import StateManagement from '../utils/StateManagement';
import EventManagement from '../../src/utils/EventManagement';
import HistoryRecorder from '../utils/HistoryRecorder';
import WTreeNode from 'src/core/WNode';

export const EDITOR_EVENTS$ = new EventManagement();

EDITOR_EVENTS$.createEvent('triggerButton1');
EDITOR_EVENTS$.createEvent('triggerButton2');
EDITOR_EVENTS$.createEvent('triggerStateChange');

type EditorStateType = {
  key: number;
};

export const EditorState = new StateManagement<EditorStateType>({
  state: {
    key: 0,
  },
});

export const PageDSLState = new StateManagement<WTreeNode | null>({
  state: null,
});

export const WTreeNodeState = new StateManagement<WTreeNode | null>({
  state: null,
});

export const EditorHistory = new HistoryRecorder({
  eventInstance: EDITOR_EVENTS$,
});

EditorHistory.registerStore(EditorState);
EditorHistory.registerStore(PageDSLState);
