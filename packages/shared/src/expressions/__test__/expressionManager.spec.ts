import { describe, expect, test } from 'vitest';
import { IWExpression } from '../../types';
import { getCustomExpression, registerExpressions } from '../expressionManager';

const testExpression = (expression: IWExpression) => {
  const { type } = expression;
  if (type === 'Test') {
    return 'testExpression';
  }
};

describe('expressionManager', () => {
  test('registerExpressions', () => {
    registerExpressions({
      Test: testExpression,
    });
    expect(getCustomExpression('Test')).toBe(testExpression);
    expect(getCustomExpression('Test1')).toBeUndefined();
    expect(getCustomExpression()).toEqual({
      Test: testExpression,
    });
  });
});
