import { describe, test, expect } from 'vitest';
import { ergodicNode } from '../ergodicNode';

const mockNode = {
  name: 'View',
  id: 't1',
  children: [
    {
      name: 'View',
      id: 't11',
    },
    {
      name: 'View',
    },
    {
      id: 't13',
    },
  ],
};

describe('ergodicNode', () => {
  test('Base', () => {
    const result = ergodicNode({
      node: mockNode,
    });
    expect(result).toEqual([
      {
        id: 't1',
        children: [{ id: 't11', name: 'View' }],
        name: 'View',
      },
    ]);
  });
  test('Callback', () => {
    const result = ergodicNode({
      node: mockNode,
      callback: (value) => {
        return value;
      },
    });
    console.log(JSON.stringify(result));
    expect(result).toEqual([
      {
        id: 't1',
        children: [
          {
            id: 't11',
            name: 'View',
            value: {
              currentNode: { name: 'View', id: 't11' },
              parentNode: {
                name: 'View',
                id: 't1',
                children: [{ name: 'View', id: 't11' }, { name: 'View' }, { id: 't13' }],
              },
              parentRenderId: 't1',
              nodeRenderId: 't11',
            },
          },
        ],
        name: 'View',
        value: {
          currentNode: {
            name: 'View',
            id: 't1',
            children: [{ name: 'View', id: 't11' }, { name: 'View' }, { id: 't13' }],
          },
          children: [
            {
              id: 't11',
              name: 'View',
              value: {
                currentNode: { name: 'View', id: 't11' },
                parentNode: {
                  name: 'View',
                  id: 't1',
                  children: [{ name: 'View', id: 't11' }, { name: 'View' }, { id: 't13' }],
                },
                parentRenderId: 't1',
                nodeRenderId: 't11',
              },
            },
          ],
          nodeRenderId: 't1',
        },
      },
    ]);
  });
});
