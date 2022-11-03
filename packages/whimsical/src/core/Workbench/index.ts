import { action, makeObservable, observable } from 'mobx';
import { IWNode } from 'whimsical-shared';
import { IRenderLayerTree } from 'src/components/CanvasRenderLayer/renderLayer';
import HistoryRecorder from 'src/utils/HistoryRecorder';
import LibManager from '../LibManager';
import WTreeNode from '../WNode';

export interface IWorkbenchProps {
  treeNode?: WTreeNode;
  wNode?: IWNode;
  History?: HistoryRecorder;
  LibInfo?: LibManager;
}

class Workbench {
  treeNode: WTreeNode;

  wNode: IWNode;

  History: HistoryRecorder;

  LibInfo: LibManager;

  renderLayerInfo: IRenderLayerTree;

  selection: WTreeNode;

  constructor(props: IWorkbenchProps) {
    const { treeNode, wNode, History, LibInfo } = props;
    this.treeNode = treeNode;
    this.wNode = wNode;
    this.History = History;
    this.LibInfo = LibInfo;

    makeObservable<Workbench, string>(this, {
      wNode: observable.shallow,
      renderLayerInfo: observable,
      selection: observable.shallow,
      setRenderLayerInfo: action,
      setSelection: action,
    });
  }

  setRenderLayerInfo(value: IRenderLayerTree) {
    this.renderLayerInfo = value;
  }

  setSelection(value: WTreeNode) {
    this.selection = value;
  }

  setWNode(value: IWNode) {
    this.wNode = value;
  }
}

export default Workbench;
