import { IWBody } from './body';
import { IWActionExpression, BodyStateType, LoopCacheType } from '.';

export interface IRuntimeContext<T = unknown> {
  wBody?: IWBody;
  // 用来保存runtime的上下文环境
  runtimeContext?: T;
}

export type IPropsGeneratorOptions = {
  state?: BodyStateType;
  context?: IRuntimeContext<unknown>;
  funcArgs?: unknown[];
  loopCache?: LoopCacheType[];
};

export type IActionModule = (
  actionItem: IWActionExpression,
  options?: IPropsGeneratorOptions
) => Promise<unknown> | void;
