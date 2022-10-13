import { createContext } from 'react';
import { IComponentDeclare } from 'whimsical-shared';

interface IEditorContext {
  componentsDeclare?: Record<string, IComponentDeclare>;
}

export const EditorContext = createContext<IEditorContext>(null);
