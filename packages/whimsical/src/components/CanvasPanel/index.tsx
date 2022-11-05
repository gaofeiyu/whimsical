import React from 'react';
import { observer } from 'mobx-react-lite';
import CanvasEditLayer from '../CanvasEditLayer';
import CanvasRenderLayer from '../CanvasRenderLayer';
import CanvasToolbar from '../CanvasToolbar';

export type CanvasPanelProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const CanvasPanel = observer(() => {
  return (
    <div className="flex flex-auto flex-col">
      <CanvasToolbar></CanvasToolbar>
      <div className="flex-auto relative">
        <CanvasRenderLayer></CanvasRenderLayer>
        <CanvasEditLayer></CanvasEditLayer>
      </div>
    </div>
  );
});

CanvasPanel.displayName = 'CanvasPanel';

export default CanvasPanel;
