import { ReactElement, createRef, useEffect, useState } from 'react';
import Sandbox, { createSandbox } from './Sandbox';

export type CanvasRenderLayerProps = {
  children?: ReactElement | ReactElement[];
};

const CanvasRenderLayer = () => {
  const renderSandbox = createRef<HTMLIFrameElement>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (renderSandbox.current && !ready) {
      setReady(true);
      createSandbox({
        renderSandbox: renderSandbox.current,
        componentInfo: { name: 'test', resource: {} },
      }).then((lib) => {
        // code
      });
    }
  }, [renderSandbox, ready]);

  return <Sandbox ref={renderSandbox} />;
};

CanvasRenderLayer.displayName = 'CanvasRenderLayer';

export default CanvasRenderLayer;
