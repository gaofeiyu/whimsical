import { createContext } from 'react';
import WTreeNode from 'src/core/WNode';
import { IComponentDeclare } from 'whimsical-shared';

export interface IEditorContext {
  componentsDeclare?: Record<string, IComponentDeclare>;
  wTreeNode?: WTreeNode;
}

export const EditorContext = createContext<IEditorContext>(null);
