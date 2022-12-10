import { describe, expect, test } from 'vitest';
import { execProp } from '../..';
import { getJSONData } from '../json';

const mockJson = {
  type: 'JSON',
  value: {
    p1: '1',
    p2: 2,
    p3: {
      node: 1,
    },
    p4: [],
    p5: {
      type: 'JSON',
      value: {
        p6: true,
      },
    },
  },
};

const json = {
  p1: '1',
  p2: 2,
  p3: {
    node: 1,
  },
  p4: [],
  p5: {
    p6: true,
  },
};

describe('ExpressionJSON', () => {
  test('Base', () => {
    expect(getJSONData(mockJson)).toEqual(mockJson.value);
  });
  test('Normal Objcet', () => {
    expect(execProp(mockJson.value)).toEqual(json);
  });
});
