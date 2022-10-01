import { action, observable } from 'mobx';

export const editorStore = observable({
  pageDSL: {
    key: '1',
  },
  dataSource: {
    storage: {
      editor: true,
    },
  },
  get getEditorState() {
    return this.dataSource.storage.editor ? this.pageDSL.key : 'none';
  },
  changePageDSLKey: action((newKey) => {
    editorStore.pageDSL.key = newKey;
  }),
});
