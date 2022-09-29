import React from 'react';

export type CanvasEditLayerProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const CanvasEditLayer = () => {
  return <div>画布编辑层</div>;
};

CanvasEditLayer.displayName = 'CanvasEditLayer';

export default CanvasEditLayer;
