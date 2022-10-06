import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import EventManagement from './EventManagement';
import StateManagement from './StateManagement';
import uuid from './uuid';

export type HistoryRecorderProps = {
  eventInstance: EventManagement;
  storeInstance?: StateManagement<unknown>[];
};

export type HistoryItemType = {
  id: string;
  eventName: string;
  executed: boolean;
  stateSnapshot?: unknown;
};

export default class HistoryRecorder {
  private eventInstance: EventManagement;

  private storeInstance: StateManagement<unknown>[];

  private subscribeStore: Map<string, Subscription>;

  private historyList: Array<HistoryItemType>;

  private EVENTS$: EventManagement;

  private currentHistoryIndex: number;

  constructor(props: HistoryRecorderProps) {
    const { eventInstance, storeInstance = [] } = props;
    this.eventInstance = eventInstance;
    this.storeInstance = storeInstance;
    this.subscribeStore = new Map();
    this.historyList = [];
    this.EVENTS$ = new EventManagement();
    this.createEvent();
    this.record();
  }

  createEvent() {
    this.EVENTS$.createEvent('change');
  }

  registerStore<T>(storeInstance) {
    this.storeInstance.push(storeInstance as StateManagement<T>);
  }

  generateStateSnapshot() {
    return this.storeInstance.map((item) => {
      return item.getStateOfRaw();
    });
  }

  snapshotToState(snapshot) {
    this.storeInstance.forEach((item, index) => {
      return item.setState(snapshot[index]);
    });
  }

  record() {
    const eventStore = this.eventInstance.getEvents();
    eventStore.forEach((subject, subjectName) => {
      this.subscribeStore.set(
        subjectName,
        subject.subscribe({
          next: () => {
            const newHistory = {
              id: uuid(),
              eventName: subjectName,
              executed: true,
              stateSnapshot: this.generateStateSnapshot(),
            };
            this.historyList.splice(this.currentHistoryIndex + 1);
            this.historyList.push(newHistory);
            this.EVENTS$.emit('change');
            this.currentHistoryIndex = this.historyList.length - 1;
            console.log('--- this.storeInstance.getState ---', newHistory);
            console.log('trigger subjectName', this.historyList);
          },
        })
      );
    });
  }

  back(step = 1) {
    this.goto(this.historyList.length - step);
  }

  goto(index: number) {
    if (typeof index === 'undefined') return;
    const [start, end] = [this.currentHistoryIndex + 1, index + 1].sort((a, b) => a - b);
    const changeHistory = this.historyList.slice(start, end);
    changeHistory.forEach((item) => {
      item.executed = !item.executed;
    });
    this.currentHistoryIndex = index;
    this.snapshotToState(this.historyList[index].stateSnapshot);
    this.EVENTS$.emit('change');
  }

  onChange(cb) {
    return this.EVENTS$.on('change', cb);
  }

  getRecord() {
    return this.historyList;
  }
}

export const useHistory = (
  HistoryInstance: HistoryRecorder
): [Array<HistoryItemType>, HistoryRecorder] => {
  const [historyList, setList] = useState<Array<HistoryItemType>>([]);
  const [, componentUpdate] = useState({});
  useEffect(() => {
    const clear = HistoryInstance.onChange(() => {
      setList(HistoryInstance.getRecord());
      componentUpdate({});
    });
    return () => {
      clear();
    };
  }, []);
  return [historyList, HistoryInstance];
};
