import {
  ReactElement,
  createRef,
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from 'react';
import Sandbox, { createSandbox } from './Sandbox';
import { WorkbenchContext } from '../../pages/playground/context';
import { IWNode } from 'whimsical-shared';

export type CanvasRenderLayerProps = {
  children?: ReactElement | ReactElement[];
};

const CanvasRenderLayer = () => {
  const renderSandbox = createRef<HTMLIFrameElement>();
  const libEngine = useRef(null);
  const workbench = useContext(WorkbenchContext);
  const [ready, setReady] = useState(false);

  const resetRender = useCallback(
    (wNode: IWNode) => {
      if (libEngine.current && libEngine.current?.render) {
        console.log(libEngine.current?.render(wNode));
      }
    },
    [libEngine.current]
  );

  useEffect(() => {
    if (renderSandbox.current && !ready) {
      setReady(true);
      createSandbox({
        renderSandbox: renderSandbox.current,
        componentInfo: {
          name: workbench.libInfo.name,
          resource: workbench.libInfo.resource,
        },
      }).then((res) => {
        libEngine.current = res;
        resetRender(workbench.wNode);
      });
    }
  }, [renderSandbox, ready]);

  return <Sandbox ref={renderSandbox} />;
};

CanvasRenderLayer.displayName = 'CanvasRenderLayer';

export default CanvasRenderLayer;
