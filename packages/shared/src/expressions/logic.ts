import jsonLogic from 'json-logic-js';
import { execProp } from '.';
import { IWExpression } from '../types';

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
