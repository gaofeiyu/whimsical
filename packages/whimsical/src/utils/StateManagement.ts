import { action, makeObservable, observable, toJS, set } from 'mobx';

export type StateManagementProps<T> = {
  state?: T;
};

export default class StateManagement<T> {
  private state: T;
  constructor(props?: StateManagementProps<T>) {
    const { state } = props;
    this.state = state;
    makeObservable<StateManagement<T>, string>(this, {
      state: observable,
      setState: action,
    });
  }

  getState() {
    return this.state;
  }

  getStateOfRaw() {
    return toJS(this.state);
  }

  setState(newState) {
    set(this.state, newState);
  }
}
