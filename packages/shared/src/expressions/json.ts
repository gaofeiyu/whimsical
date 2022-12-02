import { execProp } from '.';
import { IWExpression } from '../types';

/**
 * 根据JSON表达式获取数据
 * @param prop
 * @param state
 */
export function getJSONData(prop: IWExpression, options?: any): any {
  const { value } = prop;
  return value ? execProp(value, options) : undefined;
}
