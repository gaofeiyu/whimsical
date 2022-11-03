import { createContext } from 'react';
import WTreeNode from 'src/core/WNode';
import Workbench from 'src/core/Workbench';
import { IComponentDeclare } from 'whimsical-shared';

export interface IEditorContext {
  componentsDeclare?: Record<string, IComponentDeclare>;
  wTreeNode?: WTreeNode;
}

export const WorkbenchContext = createContext<Workbench>(null);
