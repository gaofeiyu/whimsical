import { describe, expect, test } from 'vitest';
import { execProps, execProp } from '../index';

describe('execProp', () => {
  test('single', () => {
    expect(
      execProp({
        type: 'JSON',
        value: {
          test: 'execProp',
        },
      })
    ).toEqual({
      test: 'execProp',
    });
  });
  test('multi', () => {
    expect(
      execProp([
        {
          type: 'JSON',
          value: {
            test: 'execProp',
          },
        },
      ])
    ).toEqual([
      {
        test: 'execProp',
      },
    ]);
  });
});
