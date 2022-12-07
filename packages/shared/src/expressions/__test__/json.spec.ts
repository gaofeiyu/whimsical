import { describe, expect, test } from 'vitest';
import { getJSONData } from '../json';

const mockJson = {
  type: 'JSON',
  value: {
    p1: '1',
    p2: '2',
  },
};

describe('ExpressionJSON', () => {
  test('Base', () => {
    expect(getJSONData(mockJson)).toEqual({
      p1: '1',
      p2: '2',
    });
  });
});
