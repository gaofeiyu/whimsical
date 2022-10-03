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
    this.EVENTS$.createEvent('add');
    this.EVENTS$.createEvent('back');
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
            this.EVENTS$.emit('add');
            console.log('trigger subjectName', this.historyList);
          },
        })
      );
    });
  }

  back(step = 1) {
    const changeHistory = this.historyList.slice(-step);
    changeHistory.forEach((item) => {
      item.executed = false;
    });
    this.EVENTS$.emit('back');
  }

  backTo(index?: number) {
    if (typeof index === 'undefined') return;
    this.back(this.historyList.length - index - 1);
  }

  onChange(cb) {
    const addEvent = this.EVENTS$.on('add', cb);
    const backEvent = this.EVENTS$.on('back', cb);
    return () => {
      addEvent();
      backEvent();
    };
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
