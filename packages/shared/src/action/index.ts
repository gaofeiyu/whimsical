import { isEmpty } from '../typeof';
import { EventExpressionType, IPropsGeneratorOptions, IActionModule } from '../types';
import { syncPromise } from './sync';

let actionModule: Record<string, IActionModule> = {};

/**
 * 一个事件下的行为数组的入参是当前事件的输出的值，如点击事件中的e onClick((e) => console.log(e))
 * 行为流转会根据事件执行的顺序依次继承
 * 行为流转会带入上一个行为的函数出参
 */

// 当前行为执行仅允许执行里面的Action，不允许执行其他类型表达式
export const execEvent = (
  eventExpression: EventExpressionType,
  options?: IPropsGeneratorOptions
) => {
  return (...funcArgs) => {
    const { action = [] } = eventExpression;
    const newFuncArgs = isEmpty(funcArgs)
      ? options?.funcArgs || []
      : [...funcArgs, ...(options?.funcArgs || [])];
    // Todo 后续根据需要补充阻止事件冒泡的能力
    if (eventExpression.name === 'onClick' && funcArgs && funcArgs[0]) {
      try {
        funcArgs[0].stopPropagation();
      } catch (err) {
        console.log('没有参数或不是Event类型:', err);
      }
    }

    return syncPromise(action, actionModule, 0, {
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
