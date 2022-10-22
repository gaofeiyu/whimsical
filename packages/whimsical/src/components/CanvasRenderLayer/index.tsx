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
  const workbench = useContext(WorkbenchContext);
  const renderSandbox = createRef<HTMLIFrameElement>();
  const libEngine = useRef(null);
  const [ready, setReady] = useState(false);

  const resetRender = (wNode: IWNode, sandbox: HTMLIFrameElement) => {
    if (libEngine.current && libEngine.current?.render && sandbox) {
      const sandboxDocument = sandbox.contentDocument;
      const sandboxBody = sandboxDocument.querySelector('body');
      const renderRoot = sandboxDocument.createElement('div');
      renderRoot.id = 'renderRoot';
      libEngine.current.render(wNode, renderRoot, () => {
        sandboxBody.prepend(renderRoot);
        console.log('render after');
      });
    }
  };

  useEffect(() => {
    if (renderSandbox.current && !ready) {
      const sandbox = renderSandbox.current;
      createSandbox({
        renderSandboxDocument: sandbox.contentDocument,
        resource: workbench.libInfo.resource,
      }).then(() => {
        libEngine.current = sandbox.contentWindow[workbench.libInfo.name]?.engine || null;
        resetRender(workbench.wNode, sandbox);
      });
      setReady(true);
    }
  }, [renderSandbox, ready]);

  return <Sandbox ref={renderSandbox} />;
};

CanvasRenderLayer.displayName = 'CanvasRenderLayer';

export default CanvasRenderLayer;
