import React from 'react';
import CanvasEditLayer from '../CanvasEditLayer';
import CanvasRenderLayer from '../CanvasRenderLayer';
import CanvasToolbar from '../CanvasToolbar';

export type CanvasPanleProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const CanvasPanle = () => {
  return (
    <div>
      <CanvasToolbar></CanvasToolbar>
      <div>
        <CanvasEditLayer></CanvasEditLayer>
        <CanvasRenderLayer></CanvasRenderLayer>
      </div>
    </div>
  );
};

CanvasPanle.displayName = 'CanvasPanle';

export default CanvasPanle;
