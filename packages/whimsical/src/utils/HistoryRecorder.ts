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

  private currentHistoryIndex: number;

  constructor(props: HistoryRecorderProps) {
    const { eventInstance, storeInstance = [] } = props;
    this.eventInstance = eventInstance;
    this.storeInstance = storeInstance;
    this.subscribeStore = new Map();
    this.historyList = [];
    this.createEvent();
    this.record();
  }

  createEvent() {
    this.eventInstance.createEvent('history:add');
    this.eventInstance.createEvent('history:goto');
  }

  registerStore<T>(storeInstance) {
    this.storeInstance.push(storeInstance as StateManagement<T>);
  }

  generateStateSnapshot() {
    return this.storeInstance.map((item) => {
      return item.serialize();
    });
  }

  snapshotToState(snapshot) {
    this.storeInstance.forEach((item, index) => {
      return item.from(snapshot[index]);
    });
  }

  record() {
    const eventStore = this.eventInstance.getEvents();
    eventStore.forEach((subject, subjectName) => {
      if (subjectName === 'history:add' || subjectName === 'history:goto') return;
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
            this.eventInstance.emit('history:add');
            this.currentHistoryIndex = this.historyList.length - 1;
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
    this.eventInstance.emit('history:goto');
  }

  onChange(cb) {
    const add = this.eventInstance.on('history:add', cb);
    const goto = this.eventInstance.on('history:goto', cb);

    return () => {
      add();
      goto();
    };
  }

  getRecord() {
    return this.historyList || [];
  }
}

export const useHistory = (
  HistoryInstance: HistoryRecorder
): [Array<HistoryItemType>, HistoryRecorder] => {
  const [historyList, setList] = useState<Array<HistoryItemType>>(HistoryInstance.getRecord());
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
