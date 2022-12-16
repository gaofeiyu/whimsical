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
      value: 'TestAction',
    });
  });
};

const TestActionSuccess: IActionModule = (actionItem: IWActionExpression) => {
  return new Promise((resolve) => {
    resolve({
      type: 'Action',
      actionName: 'TestActionSuccess',
      status: 'success',
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
    },
  ],
};

const actionModule = {
  TestAction: TestAction,
  TestActionSuccess: TestActionSuccess,
  TestActionFail: TestActionFail,
  TestActionFinaly: TestActionFinaly,
};
describe('eventManager', () => {
  test('registerActionModule', () => {
    const TestActionSuccessSpy = vi.spyOn(actionModule, 'TestActionSuccess');
    registerActionModule(actionModule);
    const actionInstance = execEvent({
      name: 'onClick',
      action: [testAction],
    })();
    expect(actionInstance).toBeInstanceOf(Promise);
    actionInstance.then((res) => {
      // 这里是当前事件中所有流程正常走完后执行
      expect(res).toEqual({
        type: 'Action',
        actionName: 'TestAction',
        status: 'success',
        target: {
          type: 'Action',
          actionName: 'TestAction',
          success: [
            {
              type: 'Action',
              actionName: 'TestActionSuccess',
            },
          ],
        },
        value: 'TestAction',
      });
      expect(TestActionSuccessSpy).toHaveBeenCalledTimes(1);
    });
  });
});
