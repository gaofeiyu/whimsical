import { isArray, isObject } from '../typeof';
import {
  IPropsGeneratorOptions,
  IWActionExpression,
  IWExpression,
  IWNodePropsValue,
} from '../types';
import { getCustomExpression } from './expressionManager';
import { getJSONData } from './json';
import { execLogic } from './logic';
import { getFunctionArguments, getLoopStateData, getNormalData } from './state';
import { execEvent } from '../action';

export function execProps(props: IWExpression[], options?: IPropsGeneratorOptions): any {
  if (!isArray(props)) return [];
  return props.map((prop) => {
    return execProp(prop, options);
  });
}

/**
 * 根据属性表达式情况生成最终值并返回
 * @param prop 属性值
 * @param options 扩展参数
 */
export function execProp(prop: IWNodePropsValue, options?: IPropsGeneratorOptions): any {
  if (isArray(prop)) return execProps(prop as [], options);
  let result: any = {};
  if (!prop || !isObject(prop)) return prop;
  const expressionProp = prop as IWExpression;
  switch (expressionProp.type) {
    case 'API':
    case 'Store':
      result = getNormalData(expressionProp, options);
      break;
    case 'FunctionArguments':
      result = getFunctionArguments(expressionProp, options);
      break;
    case 'Logic':
      result = execLogic(expressionProp, options);
      break;
    case 'LoopState':
      result = getLoopStateData(expressionProp, options);
      break;
    case 'JSON':
      result = getJSONData(expressionProp);
      break;
    case 'Action':
      // 行为执行比较特殊，返回的是一个promise
      result = execEvent(
        {
          name: 'EXEC_ACTION',
          action: [expressionProp as IWActionExpression],
        },
        options
      )();
      break;
    case 'boolean':
      result = !!expressionProp.value;
      break;
    case 'string':
      result = '' + expressionProp.value;
      break;
    case 'number':
      result = expressionProp.value;
      break;
    default:
      if (expressionProp.type) {
        const customExpressions = getCustomExpression(expressionProp.type);
        if (customExpressions) {
          // 事件的实现类型不确定
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          result = (customExpressions as any)[expressionProp.type](expressionProp, options);
        }
      } else {
        // 如果不符合前面的类型就认为是object或array
        Object.keys(prop).forEach((key) => {
          result[key] = execProp(prop[key], options);
        });
      }
  }
  return result;
}

export * from './expressionManager';
