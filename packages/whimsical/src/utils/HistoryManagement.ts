import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import EventManagement from './EventManagement';
import uuid from './uuid';

export type HistoryManagementProps = {
  eventInstance: EventManagement;
};

export type HistoryItemType = {
  id: string;
  eventName: string;
  executed: boolean;
};

export default class HistoryManagement {
  private eventInstance: EventManagement;

  private subscribeStore: Map<string, Subscription>;

  private historyList: Array<HistoryItemType>;

  private EVENTS$: EventManagement;

  private currentHistoryIndex: number;

  constructor(props: HistoryManagementProps) {
    const { eventInstance } = props;
    this.eventInstance = eventInstance;
    this.subscribeStore = new Map();
    this.historyList = [];
    this.EVENTS$ = new EventManagement();
    this.createEvent();
    this.record();
  }

  createEvent() {
    this.EVENTS$.createEvent('change');
  }

  record() {
    const eventStore = this.eventInstance.getEvents();
    eventStore.forEach((subject, subjectName) => {
      this.subscribeStore.set(
        subjectName,
        subject.subscribe({
          next: () => {
            this.historyList.push({
              id: uuid(),
              eventName: subjectName,
              executed: true,
            });
            this.EVENTS$.emit('change');
            this.currentHistoryIndex = this.historyList.length - 1;
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
  HistoryInstance: HistoryManagement
): [Array<HistoryItemType>, HistoryManagement] => {
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
