import { IWNode } from 'whimsical-shared';

export const wNodeMock: IWNode = {
  name: 'View',
  id: 'Root',
  style: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  children: [
    {
      id: 'z3snrl4nc33',
      name: 'View',
      style: {
        textAlign: 'center',
        height: '100%',
      },
      props: {},
      children: [
        {
          id: 'rl5qviu65en',
          name: 'View',
          style: {
            fontSize: 'calc(10px + 2vmin)',
            margin: '20px 20px 20px 20px',
          },
          props: {},
          children: [
            {
              id: 'ag3v1ux40ld',
              name: 'Image',
              style: {
                margin: '0px 16px 0px 16px',
                height: '120px',
              },
              props: {
                src: '/src/assets/whimsical-light.svg',
              },
              children: [],
            },
            {
              id: 'jkvr1yieyuk',
              name: 'View',
              style: {
                position: 'relative',
              },
              props: {},
              children: [
                {
                  id: 'uae47df2fmb',
                  name: 'Text',
                  style: {
                    color: '#FF7F57',
                    position: 'relative',
                  },
                  props: {
                    text: 'Whimsical Test',
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
