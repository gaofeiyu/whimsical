import { IWExpression, IWNodeNodeDataType, IWActionExpression, IWNodePropsValue } from './types';
import jsonLogic from 'json-logic-js';
import { isArray, isObject } from './typeof';
import { execEvent } from './eventManager';
import { getCustomExpressions } from './expressionManager';
// 增加数学函数支持
jsonLogic.add_operation('Math', Math);

/**
 * 判断该props上是否有loop数据
 * @param props
 */
export function isLoopData(data: IWNodeNodeDataType): boolean {
  try {
    if (data.loopDataSource) {
      return ['API', 'Store', 'LoopState'].includes(data.loopDataSource.type);
    }
  } catch (err) {
    // catch code
  }
  return false;
}

/**
 * 将root.state.list的path翻译成真正的数据
 * @param state
 * @param path
 */

const regExpArrayLike = new RegExp(/^\[/);

export function transformStateData(_state: unknown, path: string): any {
  try {
    // 如果path为空返回''
    // 如果path第一位可能是数组下标或通过['fieldName']方式调用，则不需要"."开头，否则在开头加"."
    // path 目前除了state中的数据，还有可能是loopState中的数据
    // TODO 该方式有安全问题，后续修复
    // console.log(state, path);
    return eval(`_state${path ? (regExpArrayLike.test(path) ? path : '.' + path) : ''}`);
  } catch (e) {
    throw new Error('transformStateData error', e as ErrorOptions);
  }
  return [];
}

/**
 * 根据x-component-data中loopDataSource从state中获取循环数据
 * @param props
 * @param state
 */
export function getLoopData(data: IWNodeNodeDataType, options?: any): any[] | null {
  if (!isLoopData(data) || !data.loopDataSource) return null;
  const { state } = options;
  if (data?.loopDataSource?.type === 'LoopState') {
    const props = {
      type: data.loopDataSource.type,
      value: data.loopDataSource.value,
    };
    return getLoopStateData(props, options);
  } else {
    const loopDataSource = data.loopDataSource;
    return transformStateData(
      state,
      `${loopDataSource.type.toLowerCase()}.${loopDataSource.value}`
    );
  }
}

/**
 * 根据节点的LoopState获取到对应的数据
 * @param props
 * @param state
 */
export function getLoopStateData(props: IWExpression, options?: any): any {
  const { value } = props || {};
  const { loopCache } = options;
  const fullPath = value ? execProp(value, options).split('.') : null;
  if (!fullPath || loopCache.length === 0) return {};
  const from = fullPath[0];
  const path = fullPath.slice(1).join('.');
  const loopCacheItem = from === '$' ? loopCache[0] : loopCache.find((item) => from === item.from);
  let result;
  if (loopCacheItem && loopCacheItem.loopDataSource) {
    // 如果cache中的值是复杂数据需要寻址，简单数据直接返回
    if (isArray(loopCacheItem.loopDataSource) || isObject(loopCacheItem.loopDataSource)) {
      result = transformStateData(loopCacheItem.loopDataSource, path);
    } else {
      // Todo 可能存在是简单数据，但是给了path的情况，这种情况是数据错误，需要throw错误信息
      result = loopCacheItem.loopDataSource;
    }
  }
  return result;
}

/**
 * 根据API及Store表达式获取数据
 * @param prop
 * @param state
 */
export function getNormalData(prop: IWExpression, options?: any): any {
  const { state } = options;
  if ((prop.type === 'API' || prop.type === 'Store') && prop.value) {
    return transformStateData(state, `${prop.type.toLowerCase()}.${execProp(prop.value, options)}`);
  } else {
    return prop;
  }
}

/**
 * 获取上层方法的arguments
 * @param prop
 * @param args
 */
export function getFunctionArguments(prop: IWExpression, options?: any): any {
  const { funcArgs } = options;
  if (prop.value) {
    return transformStateData(funcArgs, `${execProp(prop.value, options)}`);
  } else {
    return '';
  }
}

/**
 * 根据JSON表达式获取数据
 * @param prop
 * @param state
 */
export function getJSONData(prop: IWExpression, options?: any): any {
  const { value } = prop;
  return value ? execProp(value, options) : undefined;
}

/**
 * 处理Logic表达式
 * @param current
 */
export function execLogic(logicExpression: IWExpression, options?: any): any {
  let data = {};
  if (logicExpression.params) {
    data = execProp(logicExpression.params, options);
  }
  return jsonLogic.apply(logicExpression.value, data);
}

export function execProps(props: IWExpression[], options?: any): any {
  if (!isArray(props)) return [];
  return props.map((prop) => {
    return execProp(prop, options);
  });
}

export function asyncExecProps(props: [], options?: any): any {
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
export function execProp(prop: IWNodePropsValue, options?: any): any {
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
      result = getJSONData(expressionProp, options);
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
        const customExpressions = getCustomExpressions();
        if (
          customExpressions[expressionProp.type] &&
          typeof customExpressions[expressionProp.type]
        ) {
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
