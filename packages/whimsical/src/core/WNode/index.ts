import { observable, makeObservable, action } from 'mobx';
import { isArray, IWNode } from 'whimsical-shared';
import uuid from '../../utils/uuid';
import { resetNodesParent } from './resetNodesParent';

const WTreeNodeCache = new Map<string, WTreeNode>();
class WTreeNode implements IWNode {
  id: string;

  name = 'NO_NAME_COMPONENT';

  parent?: WTreeNode;

  depth = 0;

  root: WTreeNode;

  props: Record<string | number | symbol, unknown>;

  children: WTreeNode[] = [];

  constructor(node: IWNode, parent?: WTreeNode) {
    if (node instanceof WTreeNode) {
      return node;
    }
    this.id = node.id || uuid();

    if (parent) {
      this.parent = parent;
      this.depth = parent.depth + 1;
      this.root = parent.root;
      WTreeNodeCache.set(this.id, this);
    } else {
      this.root = this;
      WTreeNodeCache.set(this.id, this);
    }

    if (node) {
      this.create(node);
    }

    makeObservable<WTreeNode, string>(this, {
      name: observable.ref,
      props: observable,
      children: observable.shallow,
      prepend: action,
      append: action,
      insertAfter: action,
      insertBefore: action,
    });
  }

  get isRoot() {
    return this === this.root;
  }

  create(node: IWNode): WTreeNode {
    if (!node) return;

    if (node.id && node.id !== this.id) {
      WTreeNodeCache.delete(this.id);
      WTreeNodeCache.set(node.id, this);
      this.id = node.id;
    }

    if (node.name) {
      this.name = node.name;
    }

    this.props = {
      ...node.props,
    };

    if (node.children) {
      this.children =
        node.children?.map?.((node) => {
          return new WTreeNode(node, this);
        }) || [];
    }
  }

  getParentByDepth(depth = 0) {
    const parent = this.parent;
    if (parent?.depth === depth) {
      return parent;
    } else {
      return parent?.getParentByDepth(depth);
    }
  }

  contains(...nodes: WTreeNode[]) {
    return nodes.every((node) => {
      if (node === this || node?.parent === this || node?.getParentByDepth(this.depth) === this) {
        return true;
      }
      return false;
    });
  }

  resetNodesParent(nodes: WTreeNode[], parent: WTreeNode) {
    return resetNodesParent(
      nodes.filter((node) => node !== this),
      parent,
      WTreeNodeCache
    );
  }

  prepend(...nodes: WTreeNode[]) {
    if (nodes.some((node) => node.contains(this))) return [];
    const newNodes = this.resetNodesParent(nodes, this);
    if (!newNodes.length) return [];
    this.children = newNodes.concat(this.children);
    return newNodes;
  }

  append(...nodes: WTreeNode[]) {
    if (nodes.some((node) => node.contains(this))) return [];
    const newNodes = this.resetNodesParent(nodes, this);
    if (!newNodes.length) return [];
    this.children = newNodes.concat(this.children);
    return newNodes;
  }

  insertAfter(...nodes: WTreeNode[]) {
    if (nodes.some((node) => node.contains(this))) return [];
    const newNodes = this.resetNodesParent(nodes, this);
    if (!newNodes.length) return [];
    this.children = newNodes.concat(this.children);
    return newNodes;
  }

  insertBefore(...nodes: WTreeNode[]) {
    if (nodes.some((node) => node.contains(this))) return [];
    const newNodes = this.resetNodesParent(nodes, this);
    if (!newNodes.length) return [];
    this.children = newNodes.concat(this.children);
    return newNodes;
  }

  findNode(node: IWNode): WTreeNode;
  findNode(node: IWNode[]): WTreeNode[];
  findNode(node: IWNode | IWNode[]): WTreeNode | WTreeNode[] {
    if (isArray(node)) {
      return [this];
    }
    return this;
  }
}

export default WTreeNode;
