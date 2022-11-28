import { IWActionExpression, BodyStateType, IRuntimeContext, LoopCacheType } from '.';

export type ActionModuleOptionsType = {
  state?: BodyStateType;
  context?: IRuntimeContext<unknown>;
  funcArgs?: unknown[];
  loopCache?: LoopCacheType[];
};

export type IActionModule = (
  actionItem: IWActionExpression,
  options: ActionModuleOptionsType
) => Promise<unknown> | void;
