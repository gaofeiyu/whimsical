import { ReactElement, useEffect, useState, useContext, useRef } from 'react';
import Sandbox, { createSandbox } from './Sandbox';
import { WorkbenchContext } from '../../pages/playground/context';
import { IWNode, loadStatic } from 'whimsical-shared';

export type CanvasRenderLayerProps = {
  children?: ReactElement | ReactElement[];
};

const resetRender = (wNode: IWNode, sandbox: HTMLIFrameElement, libEngine) => {
  if (libEngine && libEngine?.render && sandbox) {
    const sandboxDocument = sandbox.contentDocument;
    const sandboxBody = sandboxDocument.querySelector('body');
    const renderRoot = sandboxDocument.createElement('div');
    renderRoot.id = 'renderRoot';
    libEngine.render(wNode, renderRoot, () => {
      sandboxBody.prepend(renderRoot);
      console.log('render after');
    });
  }
};

const CanvasRenderLayer = () => {
  const workbench = useContext(WorkbenchContext);
  const renderSandbox = useRef<HTMLIFrameElement>();
  const libEngine = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sandbox = renderSandbox.current;
    const renderSandboxDocument = sandbox?.contentDocument;
    if (sandbox && renderSandboxDocument && !ready) {
      createSandbox({
        renderSandboxDocument,
      });
      loadStatic({
        resource: workbench.libInfo?.resource,
        container: renderSandboxDocument,
        ignoreResource: ['editor'],
      }).then(() => {
        libEngine.current = sandbox.contentWindow[workbench.libInfo.name]?.engine || null;
        resetRender(workbench.wNode, sandbox, libEngine.current);
      });
      setReady(true);
    }
  }, [renderSandbox, ready]);

  return <Sandbox ref={renderSandbox} />;
};

CanvasRenderLayer.displayName = 'CanvasRenderLayer';

export default CanvasRenderLayer;
