import { action, isObservableObject, makeObservable, observable, toJS } from 'mobx';

export default class StateManagement {
  private editorState: any;
  private pageDSL: any;
  constructor() {
    this.editorState = {
      key: '1',
    };
    this.pageDSL = {
      storage: {
        editor: true,
      },
    };
    makeObservable<StateManagement, string>(this, {
      editorState: observable,
      pageDSL: observable,
      setState: action,
    });
  }

  getState() {
    return {
      editorState: toJS(this.editorState),
      pageDSL: toJS(this.pageDSL),
    };
  }

  setState(newState) {
    this.editorState = newState.editorState;
    this.pageDSL = newState.pageDSL;
  }
}
