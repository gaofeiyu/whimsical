import { describe, expect, test } from 'vitest';
import { execEvent, registerActionModule } from '../eventManager';
import { IWActionExpression, IActionModule } from '../types';

const TestAction: IActionModule = () => {
  return new Promise((resolve) => {
    return resolve('TestAction');
  });
};

const TestActionSuccess: IActionModule = () => {
  return new Promise((resolve) => {
    return resolve('TestActionSuccess');
  });
};

const TestActionFail: IActionModule = () => {
  return new Promise((resolve) => {
    return resolve('TestActionFail');
  });
};

const TestActionFinaly: IActionModule = () => {
  return new Promise((resolve) => {
    return resolve('TestActionFinaly');
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
    actionInstance.then((res) => {
      expect(res).toBe('TestAction');
    });
  });
});
