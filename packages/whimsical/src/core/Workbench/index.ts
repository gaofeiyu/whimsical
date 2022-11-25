import { action, makeObservable, observable } from 'mobx';
import { IWNode, BodyStateType } from 'whimsical-shared';
import { IRenderLayerTree } from 'src/components/CanvasRenderLayer/renderLayer';
import HistoryRecorder from 'src/utils/HistoryRecorder';
import LibManager from '../LibManager';
import WTreeNode from '../WNode';

export interface IWorkbenchProps {
  treeNode?: WTreeNode;
  node?: IWNode;
  state?: BodyStateType;
  History?: HistoryRecorder;
  LibInfo?: LibManager;
}

class Workbench {
  treeNode: WTreeNode;

  node: IWNode;

  state: BodyStateType;

  History: HistoryRecorder;

  LibInfo: LibManager;

  renderLayerInfo: IRenderLayerTree;

  selection: WTreeNode;

  constructor(props: IWorkbenchProps) {
    const { treeNode, node, History, LibInfo, state } = props;
    this.treeNode = treeNode;
    this.node = node;
    this.History = History;
    this.LibInfo = LibInfo;
    this.state = state;

    makeObservable<Workbench, string>(this, {
      node: observable.shallow,
      state: observable,
      renderLayerInfo: observable,
      selection: observable.shallow,
      setRenderLayerInfo: action,
      setSelection: action,
      setBodyState: action,
    });
  }

  setRenderLayerInfo(value: IRenderLayerTree) {
    this.renderLayerInfo = value;
  }

  setSelection(value: WTreeNode) {
    this.selection = value;
  }

  setWNode(value: IWNode) {
    this.node = value;
  }

  setBodyState(state: BodyStateType) {
    this.state = state;
  }
}

export default Workbench;
