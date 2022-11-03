import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext } from 'react';
import { WorkbenchContext } from 'src/pages/playground/context';
import { EDITOR_EVENTS$, PageDSLState } from 'src/editor-flow';

export type EventManagerProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const TestState1 = observer(() => {
  const context = useContext(WorkbenchContext);
  console.log('rerender TestState1', context);
  return (
    <div className="flex flex-auto flex-col">
      <div>PageDSLState: {JSON.stringify(PageDSLState.serialize())}</div>
    </div>
  );
});

const EventManager = () => {
  const handleClick1 = useCallback(() => {
    EDITOR_EVENTS$.emit('triggerButton1');
  }, []);
  const handleClick2 = useCallback(() => {
    EDITOR_EVENTS$.emit('triggerButton2');
  }, []);
  return (
    <div>
      <Button onClick={handleClick1}>事件触发1</Button>
      <Button onClick={handleClick2}>事件触发2</Button>
      <TestState1></TestState1>
    </div>
  );
};

EventManager.displayName = 'EventManager';

export default EventManager;
