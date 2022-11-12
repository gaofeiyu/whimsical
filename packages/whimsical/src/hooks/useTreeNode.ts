import { useWorkbench } from './useWorkbench';

export const useTreeNode = () => {
  const workbanch = useWorkbench();
  return workbanch.treeNode;
};
