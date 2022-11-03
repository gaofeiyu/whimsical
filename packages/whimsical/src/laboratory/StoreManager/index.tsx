import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import { EditorState, EDITOR_EVENTS$ } from 'src/editor-flow';

export type StoreManagerProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const StoreManager = () => {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    EditorState.from({
      key: count,
    });
    setCount(count + 1);

    EDITOR_EVENTS$.emit('triggerStateChange');
  }, [count]);
  return <Button onClick={handleClick}>数据变更</Button>;
};

StoreManager.displayName = 'StoreManager';

export default StoreManager;
