import { makeAutoObservable } from 'mobx';

export interface INode {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>;
  children?: INode[];
}

export type EditorAction =
  | 'append'
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  executeCommand(action: EditorAction, targetId: string | null, payload?: any) {
    // If a targetId is provided, we route the command to that specific node.
    // If no targetId is provided (or if it matches the root), the command applies to the root.
    const targetNode = targetId ? this.findNodeById(targetId) : this;

    if (!targetNode) {
      console.warn(`Node with id ${targetId} not found.`);
      return;
    }

    switch (action) {
      case 'append':
        if (!payload || !payload.type) {
          console.warn('Append requires a valid node payload');
          return;
        }
        targetNode.append(payload);
        break;
      case 'remove':
        targetNode.remove();
        break;
      case 'updateProps':
        if (!payload) return;
        targetNode.updateProps(payload);
        break;
      default:
        console.warn(`Unsupported action: ${action}`);
    }
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
  props: { style: { minHeight: '100%', padding: '20px' } },
  children: []
});
