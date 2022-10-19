import { ReactElement, createRef, useEffect, useState, useContext } from 'react';
import Sandbox, { createSandbox } from './Sandbox';
import { WorkbenchContext } from '../../pages/playground/context';

export type CanvasRenderLayerProps = {
  children?: ReactElement | ReactElement[];
};

const CanvasRenderLayer = () => {
  const renderSandbox = createRef<HTMLIFrameElement>();
  const workbench = useContext(WorkbenchContext);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (renderSandbox.current && !ready) {
      setReady(true);
      createSandbox({
        renderSandbox: renderSandbox.current,
        componentInfo: {
          name: workbench.libInfo.name,
          resource: workbench.libInfo.resource,
        },
      }).then((libEngine) => {
        console.log(libEngine);
      });
    }
  }, [renderSandbox, ready]);

  return <Sandbox ref={renderSandbox} />;
};

CanvasRenderLayer.displayName = 'CanvasRenderLayer';

export default CanvasRenderLayer;
