import { action, makeObservable, observable, toJS, set } from 'mobx';

export type StateManagementProps<T> = {
  state?: T;
};

export default class StateManagement<T> {
  state: T;

  constructor(state: T) {
    this.state = state;
    makeObservable<StateManagement<T>, string>(this, {
      state: observable,
      from: action,
    });
  }

  serialize() {
    return toJS(this.state);
  }

  from(newState: T) {
    set(this.state, newState);
  }
}
