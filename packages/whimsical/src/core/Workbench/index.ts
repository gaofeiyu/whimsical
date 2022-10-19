import HistoryRecorder from 'src/utils/HistoryRecorder';
import { IWNode } from 'whimsical-shared';
import LibManager from '../LibManager';
import WTreeNode from '../WNode';

export interface IWorkbenchProps {
  treeNode?: WTreeNode;
  wNode?: IWNode;
  History?: HistoryRecorder;
  libInfo?: LibManager;
}

class Workbench {
  treeNode?: WTreeNode;
  wNode?: IWNode;
  History?: HistoryRecorder;
  libInfo?: LibManager;
  constructor(props: IWorkbenchProps) {
    const { treeNode, wNode, History, libInfo } = props;
    this.treeNode = treeNode;
    this.wNode = wNode;
    this.History = History;
    this.libInfo = libInfo;
  }
}

export default Workbench;
