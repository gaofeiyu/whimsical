import { Subject } from 'rxjs';

export type EventSubjectType = Map<string, Subject<null>>;

export default class EventManagement {
  private eventStore: EventSubjectType;
  constructor() {
    this.eventStore = new Map();
  }
  getEvents() {
    return this.eventStore;
  }
  createEvent(name: string) {
    this.eventStore.set(name, new Subject());
    return this.eventStore.get(name);
  }
  emit(name, value?) {
    if (!this.eventStore.has(name)) {
      this.eventStore.set(name, new Subject());
    }
    this.eventStore.get(name).next(value);
    return this.eventStore.get(name);
  }
  on(name, cb) {
    const eventItem = this.eventStore.get(name).subscribe({
      next: cb,
    });
    return () => {
      eventItem.unsubscribe();
    };
  }
}
