import { useWorkbench } from './useWorkbench';

export const useCurrentNode = () => {
  const workbanch = useWorkbench();
  return workbanch.selection;
};
