import { makeAutoObservable } from 'mobx';
import { globalHistory } from './HistoryManager';

export interface INode {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>;
  children?: INode[];
}

export type EditorAction =
  | 'append'
  | 'insertBefore'
  | 'insertAfter'
  | 'remove'
  | 'updateProps';

export class NodeTree {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  children: NodeTree[];
  parent: NodeTree | null;

  constructor(node: INode, parent: NodeTree | null = null) {
    this.id = node.id || crypto.randomUUID();
    this.type = node.type || 'div';
    this.props = node.props || {};
    this.children = (node.children || []).map(child => new NodeTree(child, this));
    this.parent = parent;

    makeAutoObservable(this);
  }

  append(node: INode) {
    const newNode = new NodeTree(node, this);
    this.children.push(newNode);
    return newNode;
  }

  insertBefore(node: INode) {
    if (!this.parent) return;
    const index = this.parent.children.findIndex(child => child.id === this.id);
    if (index > -1) {
      const newNode = new NodeTree(node, this.parent);
      this.parent.children.splice(index, 0, newNode);
    }
  }

  insertAfter(node: INode) {
    if (!this.parent) return;
    const index = this.parent.children.findIndex(child => child.id === this.id);
    if (index > -1) {
      const newNode = new NodeTree(node, this.parent);
      this.parent.children.splice(index + 1, 0, newNode);
    }
  }

  remove() {
    if (this.parent) {
      this.parent.children = this.parent.children.filter(child => child.id !== this.id);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProps(newProps: Record<string, any>) {
    this.props = { ...this.props, ...newProps };
  }

  findNodeById(id: string): NodeTree | null {
    if (this.id === id) return this;
    for (const child of this.children) {
      const found = child.findNodeById(id);
      if (found) return found;
    }
    return null;
  }

  loadFromData(nodeData: INode) {
    this.id = nodeData.id;
    this.type = nodeData.type;
    this.props = nodeData.props || {};
    this.children = (nodeData.children || []).map(child => new NodeTree(child, this));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  executeCommand(action: EditorAction, targetId: string | null, payload?: any) {
    // Capture state before mutation for history
    const preMutationState = JSON.stringify(this.serialize());

    // If a targetId is provided, we route the command to that specific node.
    // If no targetId is provided (or if it matches the root), the command applies to the root.
    const targetNode = targetId ? this.findNodeById(targetId) : this;

    if (!targetNode) {
      console.warn(`Node with id ${targetId} not found.`);
      return;
    }

    let mutationOccurred = true;

    switch (action) {
      case 'append':
        if (!payload || !payload.type) {
          console.warn('Append requires a valid node payload');
          mutationOccurred = false;
        } else {
          targetNode.append(payload);
        }
        break;
      case 'insertBefore':
        if (!payload || !payload.type) {
          mutationOccurred = false;
        } else {
          targetNode.insertBefore(payload);
        }
        break;
      case 'insertAfter':
        if (!payload || !payload.type) {
          mutationOccurred = false;
        } else {
          targetNode.insertAfter(payload);
        }
        break;
      case 'remove':
        targetNode.remove();
        break;
      case 'updateProps':
        if (!payload) {
          mutationOccurred = false;
        } else {
          targetNode.updateProps(payload);
        }
        break;
      default:
        console.warn(`Unsupported action: ${action}`);
        mutationOccurred = false;
    }

    if (mutationOccurred) {
      // For now we assume executeCommand is called on the root
      globalHistory.push(preMutationState, `${action} on ${targetId || 'root'}`);
    }
  }

  getRoot(): NodeTree {
    let current: NodeTree = this;
    while (current.parent) {
      current = current.parent;
    }
    return current;
  }

  serialize(): INode {
    return {
      id: this.id,
      type: this.type,
      props: { ...this.props },
      children: this.children.map(child => child.serialize())
    };
  }
}

// Create a singleton instance for the editor root
export const editorRoot = new NodeTree({
  id: 'root',
  type: 'Page',
  props: { backgroundColor: '#f0f2f5', padding: '24px', margin: '0' },
  children: []
});
