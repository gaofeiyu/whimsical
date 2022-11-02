import { ComponentLibInfoType, IWNode } from 'whimsical-shared';

export const componentInfoMock: ComponentLibInfoType = {
  name: 'WReact',
  resource: {
    dep: {
      script: [
        'http://127.0.0.1:8070/lib/react.development@18.2.0.js',
        'http://127.0.0.1:8070/lib/react-dom.development@18.2.0.js',
      ],
    },
    component: {
      script: ['http://127.0.0.1:8070/WReact.umd.js'],
      css: ['http://127.0.0.1:8070/style.css'],
    },
    editor: {
      script: ['http://127.0.0.1:8070/WReact.umd.js'],
    },
  },
};

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
                src: '/src/assets/logo.svg',
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
                  id: 'uae47df2fmb1',
                  name: 'Text',
                  style: {
                    color: '#FF7F57',
                    position: 'relative',
                  },
                  props: {
                    content: 'Whimsical Test1',
                  },
                },
                {
                  id: 'uae47df2fmb2',
                  name: 'Text',
                  style: {
                    color: '#FF7F57',
                    position: 'relative',
                  },
                  props: {
                    content: 'Whimsical Test2',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
