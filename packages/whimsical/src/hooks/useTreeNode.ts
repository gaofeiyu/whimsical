import WTreeNode from 'src/core/WNode';
import { useWorkbench } from './useWorkbench';

export const useTreeNode = (): WTreeNode => {
  const workbanch = useWorkbench();
  return workbanch.treeNode;
};
