import { useWorkbench } from './useWorkbench';

export const useLibInfo = () => {
  const workbanch = useWorkbench();
  return workbanch.LibInfo;
};
