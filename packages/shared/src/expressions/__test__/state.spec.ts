import { describe, expect, test } from 'vitest';
import { getNormalData } from '../state';
import { mockState } from '../__mocks__/state';

describe('ExpressionState', () => {
  test('Store', () => {
    const keys = Object.keys(mockState.store);
    const options = { state: mockState };
    keys.forEach((key) => {
      expect(
        getNormalData(
          {
            type: 'Store',
            value: key,
          },
          options
        )
      ).toBe(mockState.store[key]);
    });

    expect(
      getNormalData(
        {
          type: 'Store',
          value: 'o2.name',
        },
        options
      )
    ).toBe(mockState.store.o2.name);

    expect(
      getNormalData(
        {
          type: 'Store',
          value: 'o2.name1',
        },
        options
      )
    ).toBeUndefined();
  });
});
