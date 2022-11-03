import { useLibInfo } from './useLibInfo';

export const useComponentDeclare = (name?: string) => {
  const { componentsDeclare } = useLibInfo();
  if (name) {
    return componentsDeclare[name];
  } else {
    return componentsDeclare;
  }
};
