import { describe, expect, test, vi } from 'vitest';
import { execEvent, generatorEvents, registerActionModule } from '../eventManager';
import { IWActionExpression, IActionModule } from '../types';

const testAction: IWActionExpression = {
  type: 'Action',
  actionName: 'TestAction',
  success: [
    {
      type: 'Action',
      actionName: 'TestActionSuccess',
      success: [
        {
          type: 'Action',
          actionName: 'TestActionSuccess',
        },
      ],
      fail: [
        {
          type: 'Action',
          actionName: 'TestActionFail',
        },
      ],
    },
  ],
  finally: [
    {
      type: 'Action',
      actionName: 'TestActionFinally',
      success: [
        {
          type: 'Action',
          actionName: 'TestActionSuccess',
          fail: [
            {
              type: 'Action',
              actionName: 'TestActionFail',
            },
          ],
        },
      ],
      fail: [
        {
          type: 'Action',
          actionName: 'TestActionSuccess',
          fail: [
            {
              type: 'Action',
              actionName: 'TestActionFail',
            },
          ],
        },
      ],
      finally: [
        {
          type: 'Action',
          actionName: 'TestActionFinally',
        },
      ],
    },
  ],
};

const testActionParallel: IWActionExpression = {
  type: 'Action',
  actionName: 'TestActionParallel',
};
const generatorInstance = (type) => {
  const event = {
    name: 'onTest',
    action: [testAction, testActionParallel, testAction, testActionParallel],
  };
  const options = {
    state: {
      store: {},
      api: {},
    },
  };

  if (type === 'execEvent') {
    return execEvent(event, options)('onTest');
  } else {
    return generatorEvents([event], options)['onTest']('onTest');
  }
};

const testRun = (type, done) => {
  const order: string[] = [];

  const TestAction: IActionModule = (actionItem: IWActionExpression) => {
    return new Promise((resolve) => {
      order.push('TestAction');
      resolve({
        type: 'Action',
        actionName: 'TestAction',
        status: 'success',
        target: actionItem,
        options: {
          state: {
            store: {
              test: 'TestAction',
            },
            api: {},
          },
          funcArgs: ['start'],
        },
        value: 'TestAction',
      });
    });
  };

  const TestActionParallel: IActionModule = () => {
    return new Promise((resolve) => {
      order.push('TestActionParallel');
      resolve('TestActionParallel');
    });
  };

  const TestActionSuccess: IActionModule = (actionItem: IWActionExpression) => {
    return new Promise((_, reject) => {
      order.push('TestActionSuccess');
      reject({
        type: 'Action',
        actionName: 'TestActionSuccess',
        status: 'fail',
        target: actionItem,
        value: 'TestActionSuccess',
      });
    });
  };

  const TestActionFail: IActionModule = () => {
    return new Promise((resolve) => {
      order.push('TestActionFail');
      resolve('TestActionFail');
    });
  };

  const TestActionFinally: IActionModule = () => {
    return new Promise((resolve) => {
      order.push('TestActionFinally');
      resolve('TestActionFinally');
    });
  };

  const actionModule = {
    TestAction: TestAction,
    TestActionSuccess: TestActionSuccess,
    TestActionFail: TestActionFail,
    TestActionFinally: TestActionFinally,
    TestActionParallel: TestActionParallel,
  };
  registerActionModule(actionModule);
  const TestActionSpy = vi.spyOn(actionModule, 'TestAction');
  const TestActionSuccessSpy = vi.spyOn(actionModule, 'TestActionSuccess');
  const TestActionFailSpy = vi.spyOn(actionModule, 'TestActionFail');
  const TestActionFinallySpy = vi.spyOn(actionModule, 'TestActionFinally');
  const TestActionParallelSpy = vi.spyOn(actionModule, 'TestActionParallel');
  const actionInstance = generatorInstance(type);
  expect(actionInstance).toBeInstanceOf(Promise);
  actionInstance.then((res) => {
    // 这里是当前事件中所有流程正常走完后执行
    expect(res).toEqual({
      state: {
        store: {
          test: 'TestAction',
        },
        api: {},
      },
      funcArgs: ['TestAction', 'start'],
    });
    expect(TestActionSpy).toHaveBeenCalledTimes(2);
    expect(TestActionSuccessSpy).toHaveBeenCalledTimes(4);
    expect(TestActionFailSpy).toHaveBeenCalledTimes(4);
    expect(TestActionFinallySpy).toHaveBeenCalledTimes(4);
    expect(TestActionParallelSpy).toHaveBeenCalledTimes(2);
    expect(order).toEqual([
      'TestAction',
      'TestActionSuccess',
      'TestActionFail',
      'TestActionFinally',
      'TestActionSuccess',
      'TestActionFail',
      'TestActionFinally',
      'TestActionParallel',
      'TestAction',
      'TestActionSuccess',
      'TestActionFail',
      'TestActionFinally',
      'TestActionSuccess',
      'TestActionFail',
      'TestActionFinally',
      'TestActionParallel',
    ]);
    done(null);
  });
};

describe('eventManager', () => {
  test('registerActionModule By generatorEvents', () => {
    return new Promise((done) => {
      testRun('generatorEvents', done);
    });
  });
  test('registerActionModule By execEvent', () => {
    return new Promise((done) => {
      testRun('execEvent', done);
    });
  });
});
