import React, { useEffect } from 'react';
import CanvasEditLayer from '../CanvasEditLayer';
import CanvasRenderLayer from '../CanvasRenderLayer';
import CanvasToolbar from '../CanvasToolbar';
import { editorObservable } from '../../events';

export type CanvasPanelProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const CanvasPanel = () => {
  useEffect(() => {
    editorObservable.subscribe({
      next: () => {
        console.log('CanvasPanel trigger editorObservable');
      },
    });
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
