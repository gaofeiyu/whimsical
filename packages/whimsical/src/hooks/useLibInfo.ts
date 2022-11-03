import { useContext } from 'react';
import { WorkbenchContext } from 'src/pages/playground/context';

export const useLibInfo = () => {
  const workbenchContext = useContext(WorkbenchContext);
  return workbenchContext.LibInfo;
};
