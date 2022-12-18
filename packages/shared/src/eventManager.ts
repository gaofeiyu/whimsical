import { execProp } from './expressions';
import { isEmpty } from './typeof';
import {
  EventExpressionType,
  IWActionExpression,
  IPropsGeneratorOptions,
  IActionModule,
} from './types';
import { ACTION_RESPONSE_STATUS, IActionResponse } from './types/action';

let actionModule: { [key: string]: IActionModule } = {};

interface RunActionResultBySyncProps {
  status: ACTION_RESPONSE_STATUS;
  response: IActionResponse;
  funcArgs: unknown[];
  actionList: IWActionExpression[];
  resolve: (value: unknown) => void;
  index: number;
  actionItem: IWActionExpression;
}

const runActionResultBySync = (props: RunActionResultBySyncProps) => {
  let actionResultPromise;
  const {
    status: promiseStatus,
    response,
    funcArgs,
    actionList,
    resolve,
    index,
    actionItem,
  } = props;
  const { status = promiseStatus, options = {}, value } = response;
  // 只有顶层事件给的入参是透传的，其他层级只有回调extra里面的行为可以调用到父级作用域的返回值
  const newFuncArgs = isEmpty(options.funcArgs) ? [value] : [value, ...(options.funcArgs || [])];
  const syncPromiseOptions: IPropsGeneratorOptions = {
    ...options,
    funcArgs,
  };
  const newOptions: IPropsGeneratorOptions = {
    ...options,
    funcArgs: newFuncArgs,
  };
  // 当前回调行为和update是异步处理，后面可以根据需要改成同步，或者在参数中配置同步或异步
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
      syncPromise(actionItem['finally'], 0, newOptions).then(() => {
        if (actionList[index + 1]) {
          syncPromise(actionList, index + 1, syncPromiseOptions).then(() => {
            resolve(newOptions);
          });
        } else {
          resolve(newOptions);
        }
      });
    } else {
      if (actionList[index + 1]) {
        syncPromise(actionList, index + 1, syncPromiseOptions).then(() => {
          resolve(newOptions);
        });
      } else {
        resolve(newOptions);
      }
    }
  });

  return actionResultPromise;
};

const syncPromise = (actionList: IWActionExpression[], index, options: IPropsGeneratorOptions) => {
  const { funcArgs = [] } = options;
  if (!actionList[index]) {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
  const actionItem: IWActionExpression = actionList[index];
  let actionModuleResult;
  const actionValue = actionItem.actionName && execProp(actionItem.actionName, options);

  if (actionItem.type === 'Action' && typeof actionModule[actionValue as string] === 'function') {
    actionModuleResult = actionModule[actionValue as string](actionItem, options);
  } else if (actionItem.type !== 'Action') {
    // 不是行为或者行为不是方法，按照属性解析数据，非promise
    actionModuleResult = execProp(actionItem, options);
  }

  if (!(actionModuleResult instanceof Promise)) {
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
      .then((res: IActionResponse) => {
        return runActionResultBySync({
          status: ACTION_RESPONSE_STATUS.SUCCESS,
          response: res,
          funcArgs,
          actionList,
          resolve,
          index,
          actionItem,
        });
      })
      .catch((errRes) => {
        return runActionResultBySync({
          status: ACTION_RESPONSE_STATUS.FAIL,
          response: errRes,
          funcArgs,
          actionList,
          resolve,
          index,
          actionItem,
        });
      });
  });
};

/**
 * 一个事件下的行为数组的入参是当前事件的输出的值，如点击事件中的e onClick((e) => console.log(e))
 * 行为流转会根据事件执行的顺序依次继承
 * 行为流转会带入上一个行为的函数出参
 */

// 当前事件执行仅允许执行里面的Action，不允许执行其他类型表达式
export const execEvent = (
  eventExpression: EventExpressionType,
  options?: IPropsGeneratorOptions
) => {
  return (...funcArgs) => {
    const { action = [] } = eventExpression;
    const newFuncArgs = isEmpty(funcArgs)
      ? options?.funcArgs || []
      : [...funcArgs, ...(options?.funcArgs || [])];
    if (eventExpression.name === 'onClick' && funcArgs && funcArgs[0]) {
      try {
        funcArgs[0].stopPropagation();
      } catch (err) {
        console.log('没有参数或不是Event类型:', err);
      }
    }
    // 同步执行中，缓存因事件执行变化的options，来保证后面的事件可以继承前面事件产生的结果

    // 因为返回的事件执行可能是promise，而事件执行的第一步不会对返回的promise进行处理，在出错时会抛出Uncaught的错误，如果影响上报，需要组件侧在事件执行的时候忽略这个错误
    return syncPromise(action, 0, {
      ...options,
      funcArgs: newFuncArgs,
    });
  };
};

export const generatorEvents = (
  eventOptions: EventExpressionType[],
  options?: IPropsGeneratorOptions
) => {
  const eventActions = {};
  eventOptions.forEach((eventItem) => {
    if (eventItem.name) {
      eventActions[eventItem.name] = execEvent(eventItem, options);
    }
  });
  return eventActions;
};

/**
 * 注册行为，支持动态注册
 * @param actions 以行为名为key的行为map
 */
export const registerActionModule = (actions: { [key: string]: IActionModule }) => {
  actionModule = actions;
};
