import { execProp } from './expressions';
import { isEmpty } from './typeof';
import {
  EventExpressionType,
  IWActionExpression,
  ActionModuleOptionsType,
  IActionModule,
} from './types';

let actionModule: { [key: string]: IActionModule } = {};

// 当前事件执行仅允许执行里面的Action，不允许执行其他类型表达式
export const execEvent = (
  eventExpression: EventExpressionType,
  options?: ActionModuleOptionsType
) => {
  return (...funcArgs) => {
    const { action = [] } = eventExpression;
    if (eventExpression.name === 'onClick') {
      try {
        funcArgs[0].stopPropagation();
      } catch (err) {
        console.log('没有参数或不是Event类型:', err);
      }
    }
    // 同步执行中，缓存因事件执行变化的options，来保证后面的事件可以继承前面事件产生的结果
    let scopExtend = {
      ...options,
      funcArgs: isEmpty(funcArgs) ? options?.funcArgs : funcArgs,
    };

    const asyncPromise = (actionList: IWActionExpression[], index) => {
      if (!actionList[index]) {
        return new Promise<void>((resolve) => {
          resolve();
        });
      }
      const actionItem = actionList[index];
      let actionModuleResult;
      const actionValue = actionItem.value && execProp(actionItem.value, scopExtend);

      if (
        actionItem.type === 'Action' &&
        typeof actionModule[actionValue as string] === 'function'
      ) {
        actionModuleResult = actionModule[actionValue as string](actionItem, scopExtend);
      } else if (actionItem.type !== 'Action') {
        // 不是行为或者行为不是方法，按照属性解析数据，非promise
        actionModuleResult = execProp(actionItem, scopExtend);
      }

      if (!(actionModuleResult instanceof Promise)) {
        actionModuleResult = Promise.resolve({
          type: 'Action',
          name: actionItem.value,
          status: 'success',
          target: actionItem,
          options: {
            ...scopExtend,
          },
          value: actionModuleResult,
        });
      }

      return new Promise((resolve, reject) => {
        let extraResult;
        actionModuleResult
          .then((res: any) => {
            const { status = '', options = {}, value } = res;
            const newScopExtend = { ...options };
            scopExtend = { ...options };
            // 用来标记当前是成功的请求还是失败的，如果是失败的则运行reject
            let isReject = false;
            // 只有顶层事件给的入参是透传的，其他层级只有回调extra里面的行为可以调用到父级作用域的返回值
            if (funcArgs) {
              newScopExtend.funcArgs = [value, ...funcArgs];
            }
            // 当前回调行为和update是异步处理，后面可以根据需要改成同步，或者在参数中配置同步或异步
            if (status === 'success') {
              if (actionItem.success?.length) {
                extraResult = execEvent(
                  {
                    name: 'onSuccess',
                    action: actionItem.success,
                  },
                  newScopExtend
                )();
              }
            } else if (status === 'fail') {
              isReject = true;
              if (actionItem.fail?.length) {
                extraResult = execEvent(
                  {
                    name: 'onFail',
                    action: actionItem.fail,
                  },
                  newScopExtend
                )();
              }
            }
            // 此处是为了保证整体调用链是同步的，根据回调的结果判断是否需要继续进行回调处理
            // 注：同步的设计是为了保证流程可控，未来可能需要增加配置来控制同步或者异步，来满足性能需要
            if (!(extraResult instanceof Promise)) {
              extraResult = Promise.resolve(extraResult);
            }
            // 不关心回调返回的promise状态，仅做同步处理
            extraResult.finally(() => {
              if (actionList[index + 1]) {
                asyncPromise(actionList, index + 1).then(() => {
                  isReject ? reject(res) : resolve(res);
                });
              } else {
                isReject ? reject(res) : resolve(res);
              }
            });
          })
          .catch((errRes) => {
            const newScopExtend = { ...options };
            const { value = errRes } = errRes || {};
            // 只有顶层事件给的入参是透传的，其他层级只有回调extra里面的行为可以调用到父级作用域的返回值
            if (funcArgs) {
              newScopExtend.funcArgs = [value, ...funcArgs];
            }
            if (actionItem.fail) {
              extraResult = execEvent(
                {
                  name: 'onFail',
                  action: actionItem.fail,
                },
                newScopExtend
              )();
            }
            if (!(extraResult instanceof Promise)) {
              extraResult = Promise.resolve(extraResult);
            }
            extraResult.finally(() => {
              if (actionList[index + 1]) {
                asyncPromise(actionList, index + 1)
                  .then(() => {
                    reject(errRes);
                  })
                  .catch(() => reject(errRes));
              } else {
                reject(errRes);
              }
            });
          });
      });
    };

    // 因为返回的事件执行可能是promise，而事件执行的第一步不会对返回的promise进行处理，在出错时会抛出Uncaught的错误，如果影响上报，需要组件侧在事件执行的时候忽略这个错误
    return asyncPromise(action, 0);
  };
};

export const generatorEvents = (
  eventOptions: EventExpressionType[],
  options?: ActionModuleOptionsType
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
