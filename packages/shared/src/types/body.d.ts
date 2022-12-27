import { EventExpressionType, IWNode } from './node.d';

export type BodyStateType = {
  store?: Record<string, unknown>;
  api?: Record<string, unknown>;
};

export type IWBody = {
  node: IWNode;
  state?: BodyStateType;
  lifeCycle?: {
    onCreate: EventExpressionType[];
    onMounted: EventExpressionType[];
  };
};
