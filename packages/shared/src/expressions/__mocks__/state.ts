export const mockState = {
  store: {
    str: 'test string',
    n0: 0,
    n1: 1,
    nNan: NaN,
    nInfinity: Infinity,
    boolTrue: true,
    boolFalse: false,
    arr1Empty: [],
    arr2: [1, 2, 3, 4],
    arr3HasObject: [
      {
        name: 'LeiLi',
        id: 'o1',
      },
      {
        name: 'MeimeiHan',
        id: 'o1',
      },
    ],
    o1Empty: {},
    o2: {
      name: 'LeiLi',
      id: 'o1',
    },
  },
  api: {
    getUserInfo: {
      method: 'GET',
      url: 'api/getUserInfo',
      body: {
        code: '0',
        message: 'success',
        data: {
          name: 'Goofy',
          age: 18,
        },
      },
    },
  },
};
