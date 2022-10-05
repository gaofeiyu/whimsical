import { Subject } from 'rxjs';

export type EventSubjectType = Map<string, Subject<null>>;

export type EventManagementProps = {
  staticMode?: boolean;
};

export default class EventManagement {
  private eventStore: EventSubjectType;
  staticMode?: boolean;
  constructor(props?: EventManagementProps) {
    const { staticMode = true } = props || {};
    this.eventStore = new Map();
    this.staticMode = staticMode;
  }

  getEvents() {
    return this.eventStore;
  }

  getEvent(name) {
    return this.eventStore.get(name);
  }

  createEvent(name: string) {
    this.eventStore.set(name, new Subject());
    return this.eventStore.get(name);
  }

  checkEventName(name) {
    const result = this.eventStore.has(name);
    if (!result && this.staticMode) {
      console.log(`Event Management hasn't "${name}" event`);
      throw new Error(`Event Management hasn't "${name}" event`);
    }
    return result;
  }

  emit(name, value?) {
    if (!this.checkEventName(name)) return;
    this.eventStore.get(name).next(value);
    return this.eventStore.get(name);
  }

  on(name, cb) {
    if (!this.checkEventName(name)) return;
    const eventItem = this.eventStore.get(name).subscribe({
      next: (value) => {
        cb(value);
      },
    });
    return () => {
      eventItem.unsubscribe();
    };
  }
}
