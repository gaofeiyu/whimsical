import { useContext } from 'react';
import { WorkbenchContext } from 'src/pages/playground/context';

export const useWorkbench = () => {
  const workbenchContext = useContext(WorkbenchContext);
  return workbenchContext;
};
