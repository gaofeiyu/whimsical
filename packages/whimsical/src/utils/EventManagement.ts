import { Subject, Subscription } from 'rxjs';

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

  on(name: string | string[], cb) {
    const names = typeof name === 'string' ? [name] : name;
    const eventsRemove: (
      | Subscription
      | {
          unsubscribe: () => void;
        }
    )[] = names.map((name) => {
      if (!this.checkEventName(name))
        return {
          unsubscribe: () => {
            return;
          },
        };
      return this.eventStore.get(name).subscribe({
        next: (value) => {
          cb({
            type: name,
            value,
          });
        },
      });
    });
    return () => {
      eventsRemove.forEach(
        (
          subscribe:
            | Subscription
            | {
                unsubscribe: () => void;
              }
        ) => {
          if (subscribe && subscribe.unsubscribe && typeof subscribe.unsubscribe === 'function') {
            // 类型 "Subscription" 没有调用签名。
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (subscribe as any).unsubscribe();
          }
        }
      );
    };
  }
}
