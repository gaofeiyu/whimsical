import { describe, expect, test, vi } from 'vitest';
import { execEvent, registerActionModule } from '../eventManager';
import { IWActionExpression, IActionModule } from '../types';

const TestAction: IActionModule = (actionItem: IWActionExpression) => {
  return new Promise((resolve) => {
    resolve({
      type: 'Action',
      actionName: 'TestAction',
      status: 'success',
      target: actionItem,
      options: {
        funcArgs: ['start'],
      },
      value: 'TestAction',
    });
  });
};

const TestActionParallel: IActionModule = () => {
  return new Promise((resolve) => {
    resolve('TestActionParallel');
  });
};

const TestActionSuccess: IActionModule = (actionItem: IWActionExpression) => {
  return new Promise((_, reject) => {
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
    resolve('TestActionFail');
  });
};

const TestActionFinaly: IActionModule = () => {
  return new Promise((resolve) => {
    resolve('TestActionFinaly');
  });
};

const testAction: IWActionExpression = {
  type: 'Action',
  actionName: 'TestAction',
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
  finally: [
    {
      type: 'Action',
      actionName: 'TestActionFinaly',
    },
  ],
};

const testActionParallel: IWActionExpression = {
  type: 'Action',
  actionName: 'TestActionParallel',
};

const actionModule = {
  TestAction: TestAction,
  TestActionSuccess: TestActionSuccess,
  TestActionFail: TestActionFail,
  TestActionFinaly: TestActionFinaly,
  TestActionParallel: TestActionParallel,
};
describe('eventManager', () => {
  test('registerActionModule', () => {
    const TestActionSuccessSpy = vi.spyOn(actionModule, 'TestActionSuccess');
    const TestActionFailSpy = vi.spyOn(actionModule, 'TestActionFail');
    const TestActionFinalySpy = vi.spyOn(actionModule, 'TestActionFinaly');
    const TestActionParallelSpy = vi.spyOn(actionModule, 'TestActionParallel');
    registerActionModule(actionModule);
    const actionInstance = execEvent(
      {
        name: 'onTest',
        action: [testAction, testActionParallel],
      },
      {
        state: {
          store: {},
          api: {},
        },
      }
    )('onTest');
    expect(actionInstance).toBeInstanceOf(Promise);
    actionInstance.then((res) => {
      // 这里是当前事件中所有流程正常走完后执行
      console.log('res', res);
      expect(res).toEqual({
        funcArgs: ['TestAction', 'onTest'],
      });
      expect(TestActionSuccessSpy).toHaveBeenCalledTimes(1);
      expect(TestActionFailSpy).toHaveBeenCalledTimes(1);
      expect(TestActionFinalySpy).toHaveBeenCalledTimes(1);
      expect(TestActionParallelSpy).toHaveBeenCalledTimes(1);
    });
  });
});
