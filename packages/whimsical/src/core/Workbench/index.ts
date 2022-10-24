import { action, makeObservable, observable } from 'mobx';
import { IWNode } from 'whimsical-shared';
import { IRenderLayerTree } from '../../components/CanvasRenderLayer/renderLayer';
import HistoryRecorder from '../../utils/HistoryRecorder';
import LibManager from '../LibManager';
import WTreeNode from '../WNode';

export interface IWorkbenchProps {
  treeNode?: WTreeNode;
  wNode?: IWNode;
  History?: HistoryRecorder;
  libInfo?: LibManager;
}

class Workbench {
  treeNode: WTreeNode;

  wNode: IWNode;

  History: HistoryRecorder;

  libInfo: LibManager;

  renderLayerInfo: IRenderLayerTree;

  constructor(props: IWorkbenchProps) {
    const { treeNode, wNode, History, libInfo } = props;
    this.treeNode = treeNode;
    this.wNode = wNode;
    this.History = History;
    this.libInfo = libInfo;

    makeObservable<Workbench, string>(this, {
      renderLayerInfo: observable,
      setRenderLayerInfo: action,
    });
  }

  setRenderLayerInfo(value: IRenderLayerTree) {
    this.renderLayerInfo = value;
  }
}

export default Workbench;
