import React from 'react';

export type CanvasEditLayerProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const CanvasEditLayer = () => {
  return <div className="absolute top-0 left-0 w-full h-full">画布编辑层</div>;
};

CanvasEditLayer.displayName = 'CanvasEditLayer';

export default CanvasEditLayer;
