import { useTreeNode } from './useTreeNode';

export const useWorkbenchDSL = () => {
  const treeNode = useTreeNode();
  return treeNode.serialize();
};
