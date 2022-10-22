import { IWNode } from './schema';

export interface IRuntimeContext<T = unknown> {
  node?: IWNode;
  // 用来保存runtime的上下文环境
  runtimeContext?: T;
}
