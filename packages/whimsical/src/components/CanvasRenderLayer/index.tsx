import React from 'react';

export type CanvasRenderLayerProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const CanvasRenderLayer = () => {
  return <div className="absolute top-0 left-0 w-full h-full hidden">画布渲染层</div>;
};

CanvasRenderLayer.displayName = 'CanvasRenderLayer';

export default CanvasRenderLayer;
