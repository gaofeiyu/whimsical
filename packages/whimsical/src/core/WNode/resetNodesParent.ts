import WTreeNode from '.';

const removeNode = (node: WTreeNode) => {
  if (node.parent) {
    node.parent.children = node.parent.children.filter((child) => child !== node);
  }
};

const resetDepth = (node: WTreeNode) => {
  node.depth = node.parent ? node.parent.depth + 1 : 0;
  node.children.forEach(resetDepth);
};

const shallowReset = (node: WTreeNode, parent: WTreeNode) => {
  node.parent = parent;
  node.root = parent.root;
  resetDepth(node);
};

const deepReset = (node: WTreeNode, parent: WTreeNode, WTreeNodeCache: Map<string, WTreeNode>) => {
  shallowReset(node, parent);
  resetNodesParent(node.children, node, WTreeNodeCache);
};

export const resetNodesParent = (
  nodes: WTreeNode[],
  parent: WTreeNode,
  WTreeNodeCache: Map<string, WTreeNode>
) => {
  return nodes.map((node) => {
    if (node === parent) return node;
    deepReset(node, parent, WTreeNodeCache);
    if (!WTreeNodeCache.has(node.id)) {
      WTreeNodeCache.set(node.id, node);
    }
    return node;
  });
};
