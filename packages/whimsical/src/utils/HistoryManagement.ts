import { Subscription } from 'rxjs';
import EventManagement, { EventSubjectType } from './EventManagement';

export type HistoryManagementProps = {
  eventInstance: EventManagement;
};

export default class HistoryManagement {
  private eventInstance: EventManagement;
  private subscribeStore: Map<string, Subscription>;
  constructor(props: HistoryManagementProps) {
    const { eventInstance } = props;
    this.eventInstance = eventInstance;
    this.subscribeStore = new Map();
    this.record();
  }

  record() {
    const eventStore = this.eventInstance.getEvents();
    eventStore.forEach((subject, subjectName) => {
      this.subscribeStore.set(
        subjectName,
        subject.subscribe({
          next: () => {
            console.log('trigger subjectName', subjectName);
          },
        })
      );
    });
  }
}
