import { createContext } from 'react';
import WTreeNode from '../../core/WNode';
import Workbench from '../../core/Workbench';
import { IComponentDeclare } from 'whimsical-shared';

export interface IEditorContext {
  componentsDeclare?: Record<string, IComponentDeclare>;
  wTreeNode?: WTreeNode;
}

export const WorkbenchContext = createContext<Workbench>(null);
