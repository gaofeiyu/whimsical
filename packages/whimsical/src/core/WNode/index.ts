import { observable, makeObservable, action, toJS } from 'mobx';
import { isArray, IWNode } from 'whimsical-shared';
import uuid from 'src/utils/uuid';
import { resetNodesParent, removeNode } from './resetNodesParent';
import { EDITOR_EVENTS$ } from 'src/editor-flow';

const WTreeNodeCache = new Map<string, WTreeNode>();
class WTreeNode implements IWNode {
  id: string;

  name = 'NO_NAME_COMPONENT';

  parent?: WTreeNode;

  depth = 0;

  root: WTreeNode;

  props: Record<string | number | symbol, unknown>;

  children: WTreeNode[] = [];

  isInOperation = false;

  constructor(node: IWNode | null, parent?: WTreeNode) {
    if (!node) return null;
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
      updateProps: action,
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

    this.props = props as Record<string | number | symbol, unknown>;

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
    this.children = this.children.concat(newNodes);
    EDITOR_EVENTS$.emit('node:append');
    return newNodes;
  }

  insertAfter(...nodes: WTreeNode[]) {
    const parent = this.parent;
    if (nodes.some((node) => node.contains(this))) return [];
    if (parent?.children?.length) {
      const newNodes = this.resetNodesParent(nodes, parent);
      if (!newNodes.length) return [];
      parent.children = parent.children.reduce((buf, node) => {
        if (node === this) {
          return buf.concat([node]).concat(newNodes);
        } else {
          return buf.concat([node]);
        }
      }, []);
      EDITOR_EVENTS$.emit('node:insertAfter');
      return newNodes;
    }
    return [];
  }

  insertBefore(...nodes: WTreeNode[]) {
    const parent = this.parent;
    if (nodes.some((node) => node.contains(this))) return [];
    if (parent?.children?.length) {
      const newNodes = this.resetNodesParent(nodes, parent);
      if (!newNodes.length) return [];
      parent.children = parent.children.reduce((buf, node) => {
        if (node === this) {
          return buf.concat(newNodes).concat([node]);
        } else {
          return buf.concat([node]);
        }
      }, []);
      EDITOR_EVENTS$.emit('node:insertBefore');
      return newNodes;
    }
    return [];
  }

  remove() {
    removeNode(this);
    WTreeNodeCache.delete(this.id);
    EDITOR_EVENTS$.emit('node:remove');
  }

  findNode(node: IWNode): WTreeNode;
  findNode(node: IWNode[]): WTreeNode[];
  findNode(node: IWNode | IWNode[]): WTreeNode | WTreeNode[] {
    if (isArray(node)) {
      return [this];
    }
    return this;
  }

  findById(id: string) {
    if (!id) return;
    if (this.id === id) return this;
    if (this.children?.length > 0) {
      return WTreeNodeCache.get(id);
    }
  }

  updateProps(newProps) {
    this.props = newProps;
    EDITOR_EVENTS$.emit('props:update');
  }
}

export default WTreeNode;
