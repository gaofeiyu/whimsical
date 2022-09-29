import React from 'react';

export type CanvasRenderLayerProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const CanvasRenderLayer = () => {
  return <div>画布渲染层</div>;
};

CanvasRenderLayer.displayName = 'CanvasRenderLayer';

export default CanvasRenderLayer;
