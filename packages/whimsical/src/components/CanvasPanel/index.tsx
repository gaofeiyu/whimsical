import React, { useEffect } from 'react';
import CanvasEditLayer from '../CanvasEditLayer';
import CanvasRenderLayer from '../CanvasRenderLayer';
import CanvasToolbar from '../CanvasToolbar';
import { EDITOR_EVENTS$ } from '../../events';
import { ConsoleSqlOutlined } from '@ant-design/icons';

export type CanvasPanelProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const CanvasPanel = () => {
  useEffect(() => {
    const triggerButton = EDITOR_EVENTS$.on('triggerButton', () => {
      console.log('CanvasPanel trigger editorObservable');
    });

    return () => {
      triggerButton();
    };
  }, []);
  return (
    <div className="flex flex-auto flex-col">
      <CanvasToolbar></CanvasToolbar>
      <div></div>
      <div className="flex-auto relative hidden">
        <CanvasEditLayer></CanvasEditLayer>
        <CanvasRenderLayer></CanvasRenderLayer>
      </div>
    </div>
  );
};

CanvasPanel.displayName = 'CanvasPanel';

export default CanvasPanel;
