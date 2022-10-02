import { Subject } from 'rxjs';

export class EventManagement {
  private eventStore: any;
  constructor() {
    this.eventStore = {};
  }
  getEvents() {
    return this.eventStore;
  }
  createEvent(name: string) {
    this.eventStore[name] = new Subject();
    return this.eventStore[name];
  }
  emit(name, value?) {
    if (!this.eventStore[name]) {
      this.eventStore[name] = new Subject();
    }
    this.eventStore[name].next(value);
    return this.eventStore[name];
  }
  on(name, cb) {
    // const observable = new Observable();
    const eventItem = this.eventStore[name].subscribe({
      next: cb,
    });
    return () => {
      eventItem.unsubscribe();
    };
  }
}

const EDITOR_EVENTS$ = new EventManagement();

EDITOR_EVENTS$.createEvent('triggerButton');

export default EDITOR_EVENTS$;
