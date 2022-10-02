import { Button } from 'antd';
import React, { useCallback } from 'react';
import { EDITOR_EVENTS$ } from '../../events';

export type EventManagerProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const EventManager = () => {
  const handleClick = useCallback(() => {
    EDITOR_EVENTS$.emit('triggerButton');
  }, []);
  return <Button onClick={handleClick}>事件触发</Button>;
};

EventManager.displayName = 'EventManager';

export default EventManager;
