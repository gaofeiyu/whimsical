import { IWBody } from './body';

export interface IRuntimeContext<T = unknown> {
  wBody?: IWBody;
  // 用来保存runtime的上下文环境
  runtimeContext?: T;
}
