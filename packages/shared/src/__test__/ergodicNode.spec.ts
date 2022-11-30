import { describe, test, expect } from 'vitest';
import { ergodicNode } from '../ergodicNode';

import { IWNode } from '../types';
import uuid from '../utils/uuid';

const mockNode: IWNode = {
  name: 'view',
  id: uuid(),
  children: [
    {
      name: 'view',
      id: uuid(),
    },
  ],
};

describe('ergodicNode', () => {
  test('Normal', () => {
    const result = ergodicNode({
      node: mockNode,
    });
    expect(result).toEqual(result);
  });
});
