import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import { editorStore } from '../../store/editorActions';

export type StoreManagerProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const StoreManager = () => {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    console.log(count);
    editorStore.changePageDSLKey(`${count}`);
    setCount(count + 1);
  }, [count]);
  return <Button onClick={handleClick}>数据变更</Button>;
};

StoreManager.displayName = 'StoreManager';

export default StoreManager;
