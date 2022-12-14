import { describe, expect, test } from 'vitest';
import { getComponent, registerComponents } from '../componentManager';

const testExpression = () => {
  return null;
};

describe('componentManager', () => {
  test('registerComponents', () => {
    registerComponents({
      Test: testExpression,
    });
    expect(getComponent('Test')).toBe(testExpression);
    expect(getComponent('Test1')).toBeUndefined();
    expect(getComponent()).toEqual({
      Test: testExpression,
    });
  });
});
