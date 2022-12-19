import { execEvent } from '.';
import { execProp } from '../expressions';
import { isEmpty } from '../typeof';
import { IWActionExpression, IPropsGeneratorOptions, IActionModule } from '../types';
import { ACTION_RESPONSE_STATUS, IActionResponse } from '../types/action';

export interface ISyncActionFlowProps {
  // 当前行为的状态
  status: ACTION_RESPONSE_STATUS;
  // 当前行为的返回
  response: IActionResponse;
  // 上游行为流的入参数组，不包含当前行为的出参（用来给后续行为流中同级别的行为传递）
  funcArgs: unknown[];
  // 同级别的行为列表
  actionList: IWActionExpression[];
  // 当前行为Promise中的resolve，用来回传属于该行为节点分支下，所有行为执行后的options值
  resolve: (options: unknown) => void;
  // 当前行为在actionList中的下标
  index: number;
  // 当前行为的表达式
  actionItem: IWActionExpression;
  // 行为组件集合
  actionModule: Record<string, IActionModule>;
}

/**
 * 行为执行结束后，同步执行后续的行为流
 * @param props
 * @returns
 */
export const syncActionFlow = (props: ISyncActionFlowProps) => {
  let actionResultPromise;
  const {
    status: promiseStatus,
    response,
    funcArgs,
    actionList,
    resolve,
    index,
    actionItem,
    actionModule,
  } = props;
  const { status = promiseStatus, options = {}, value } = response;
  // 给当前行为节点下的入参
  const newFuncArgs = isEmpty(options.funcArgs) ? [value] : [value, ...(options.funcArgs || [])];
  // actionList下一个元素的options入参
  const syncPromiseOptions: IPropsGeneratorOptions = {
    ...options,
    funcArgs,
  };
  // 当前行为下一个执行节点的options入参
  const newOptions: IPropsGeneratorOptions = {
    ...options,
    funcArgs: newFuncArgs,
  };
  // 对自定义行为组件的返回进行校准，仅在实际返回和当前行为返回一致的时候，才执行对应的后续行为
  if (status === promiseStatus) {
    if (actionItem[status]?.length) {
      actionResultPromise = execEvent(
        {
          name: status === ACTION_RESPONSE_STATUS.SUCCESS ? 'onSuccess' : 'onFail',
          action: actionItem[status],
        },
        newOptions
      )();
    }
  }
  // 此处是为了保证整体调用链是同步的，根据回调的结果判断是否需要继续进行回调处理
  // 注：同步的设计是为了保证流程可控，未来可能需要增加配置来控制同步或者异步，来满足性能需要
  if (!(actionResultPromise instanceof Promise)) {
    actionResultPromise = Promise.resolve(actionResultPromise);
  }
  // 不关心回调返回的promise状态，仅做同步处理
  actionResultPromise.finally(() => {
    if (actionItem['finally']?.length) {
      syncPromise(actionItem['finally'], actionModule, 0, newOptions).then(() => {
        if (actionList[index + 1]) {
          syncPromise(actionList, actionModule, index + 1, syncPromiseOptions).then(() => {
            resolve(newOptions);
          });
        } else {
          resolve(newOptions);
        }
      });
    } else {
      if (actionList[index + 1]) {
        syncPromise(actionList, actionModule, index + 1, syncPromiseOptions).then(() => {
          resolve(newOptions);
        });
      } else {
        resolve(newOptions);
      }
    }
  });

  return actionResultPromise;
};

/**
 * 对行为流进行同步执行
 * @param actionList
 * @param actionModule
 * @param index
 * @param options
 * @returns
 */
export const syncPromise = (
  actionList: IWActionExpression[],
  actionModule: Record<string, IActionModule>,
  index = 0,
  options?: IPropsGeneratorOptions
): PromiseLike<unknown> => {
  const { funcArgs = [] } = options || {};
  // 如果行为列表为空则发挥一个空的Promise
  if (!actionList[index]) {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
  const actionItem: IWActionExpression = actionList[index];
  let actionModuleResult;
  const actionValue = actionItem.actionName && execProp(actionItem.actionName, options);

  if (actionItem.type === 'Action' && typeof actionModule[actionValue as string] === 'function') {
    // 当前表达式是行为，且包含处理这个行为的组件
    actionModuleResult = actionModule[actionValue as string](actionItem, options);
  } else if (actionItem.type !== 'Action') {
    // 不是行为或者行为不是方法，按照属性解析数据
    actionModuleResult = execProp(actionItem, options);
  }

  if (!(actionModuleResult instanceof Promise)) {
    // 通过行为解析器解析的，强制使用Promise，保证行为一致
    actionModuleResult = Promise.resolve({
      type: 'Action',
      actionName: actionItem.actionName,
      status: ACTION_RESPONSE_STATUS.SUCCESS,
      target: actionItem,
      options,
      value: actionModuleResult,
    });
  }

  return new Promise((resolve) => {
    actionModuleResult
      .then((res: IActionResponse) =>
        syncActionFlow({
          status: ACTION_RESPONSE_STATUS.SUCCESS,
          response: res,
          funcArgs,
          actionList,
          resolve,
          index,
          actionItem,
          actionModule,
        })
      )
      .catch((errRes) =>
        // 这里注意不管成功失败，只要流程上是正常执行，都是resolve，而不是reject
        syncActionFlow({
          status: ACTION_RESPONSE_STATUS.FAIL,
          response: errRes,
          funcArgs,
          actionList,
          resolve,
          index,
          actionItem,
          actionModule,
        })
      );
  });
};
