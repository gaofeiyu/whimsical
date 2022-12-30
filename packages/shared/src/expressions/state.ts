import { execProp } from '.';
import { isArray, isObject } from '../typeof';
import { IPropsGeneratorOptions, IWExpression, IWNodeNodeDataType } from '../types';

/**
 * 将root.state.list的path翻译成真正的数据
 * @param state
 * @param path
 */

const regExpArrayLike = new RegExp(/^\[/);

export function transformStateData(_state: unknown, path: string): unknown {
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
}

/**
 * 根据API及Store表达式获取数据
 * @param prop
 * @param state
 */
export function getNormalData(prop: IWExpression, options?: IPropsGeneratorOptions): any {
  const { state } = options || {};
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
export function getFunctionArguments(prop: IWExpression, options?: IPropsGeneratorOptions): any {
  const { funcArgs } = options || {};
  if (prop.value) {
    return transformStateData(funcArgs, `${execProp(prop.value, options)}`);
  } else {
    return '';
  }
}

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
 * 根据x-component-data中loopDataSource从state中获取循环数据
 * @param props
 * @param state
 */
export function getLoopData(
  data: IWNodeNodeDataType,
  options?: IPropsGeneratorOptions
): unknown | null {
  if (!isLoopData(data) || !data.loopDataSource) return null;
  const { state } = options || {};
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
  if (!fullPath || !loopCache || loopCache.length === 0) return {};
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
