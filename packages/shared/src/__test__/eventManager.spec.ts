import { describe, expect, test } from 'vitest';
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
    console.log('-------TestActionSuccess');
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

describe('eventManager', () => {
  test('registerActionModule', () => {
    registerActionModule({
      TestAction: TestAction,
      TestActionSuccess: TestActionSuccess,
      TestActionFail: TestActionFail,
      TestActionFinaly: TestActionFinaly,
    });
    const actionInstance = execEvent({
      name: 'onClick',
      action: [testAction],
    })();
    expect(actionInstance instanceof Promise).toBe(true);
    actionInstance
      .then((res) => {
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
      })
      .then((res) => {
        console.log(res);
      });
  });
});
