import { Button } from 'antd';
import React, { useCallback } from 'react';
import { EDITOR_EVENTS$ } from '../../editor-flow';

export type EventManagerProps = {
  children?: React.ReactElement | React.ReactElement[];
};

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
    </div>
  );
};

EventManager.displayName = 'EventManager';

export default EventManager;
