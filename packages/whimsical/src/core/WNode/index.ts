import { observable, makeObservable, action, toJS } from 'mobx';
import { isArray, IWNode } from 'whimsical-shared';
import uuid from '../../utils/uuid';
import { resetNodesParent } from './resetNodesParent';
import { EDITOR_EVENTS$ } from '../../editor-flow';

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
      this.from(node);
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

  create(node: IWNode, parent?: WTreeNode) {
    return new WTreeNode(node, parent);
  }

  from(node: IWNode): WTreeNode {
    if (!node) return;
    const { id, name, children, ...props } = node;

    if (id && id !== this.id) {
      WTreeNodeCache.delete(this.id);
      WTreeNodeCache.set(id, this);
      this.id = id;
    }

    if (name) {
      this.name = name;
    }

    this.props = props;

    if (children) {
      this.children =
        children?.map?.((node) => {
          return new WTreeNode(node, this);
        }) || [];
    }
  }

  serialize(): IWNode {
    return {
      id: this.id,
      name: this.name,
      children: this.children.map((treeNode) => {
        return treeNode.serialize();
      }),
      ...toJS(this.props),
    };
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
    EDITOR_EVENTS$.emit('node:prepend');
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
