import { describe, expect, test } from 'vitest';
import { execLogic } from '../logic';
import { mockState } from '../__mocks__/state';

describe('ExpressionLogic', () => {
  test('Base', () => {
    expect(
      execLogic(
        {
          type: 'Logic',
          value: {
            '+': [
              {
                var: 'n0',
              },
              {
                var: 'n1',
              },
              {
                var: 'n2',
              },
              {
                var: 'n3',
              },
            ],
          },
          params: {
            n0: {
              type: 'Store',
              value: 'n0',
            },
            n1: {
              type: 'Store',
              value: 'n1',
            },
            n2: 2,
            n3: -3,
          },
        },
        {
          state: mockState,
        }
      )
    ).toBe(0);
  });
});
