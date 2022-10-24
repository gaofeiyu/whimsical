import { ReactElement, useEffect, useState, useContext, useRef } from 'react';
import { IWNode, loadStatic } from 'whimsical-shared';
import Sandbox, { createSandbox } from './Sandbox';
import { WorkbenchContext } from '../../pages/playground/context';
import { collectionNodeSize } from './collectionNodeSize';
import { IRenderLayerTree } from './renderLayer';
import Workbench from '../../core/Workbench';

export type CanvasRenderLayerProps = {
  children?: ReactElement | ReactElement[];
};

let renderLayerCollection: IRenderLayerTree = {};

const resetRender = (wNode: IWNode, sandbox: HTMLIFrameElement, libEngine) => {
  if (libEngine && libEngine?.render && sandbox) {
    return new Promise((resolve) => {
      const sandboxDocument = sandbox.contentDocument;
      const sandboxBody = sandboxDocument.querySelector('body');
      const renderRoot = sandboxDocument.createElement('div');
      renderRoot.id = 'renderRoot';
      libEngine.render(wNode, renderRoot, () => {
        sandboxBody.prepend(renderRoot);
        console.log('render after');
        resolve(renderRoot);
      });
    });
  } else {
    return Promise.reject('NO_LIB_ENGINE');
  }
};

const CanvasRenderLayer = () => {
  const workbench = useContext(WorkbenchContext);
  const renderSandbox = useRef<HTMLIFrameElement>();
  const libEngine = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sandbox = renderSandbox.current;
    const sandboxDocument = sandbox?.contentDocument;
    if (sandbox && sandboxDocument && !ready) {
      createSandbox({
        sandboxDocument,
      });
      loadStatic({
        resource: workbench.libInfo?.resource,
        container: sandboxDocument,
        ignoreResource: ['editor'],
      }).then(() => {
        libEngine.current = sandbox.contentWindow[workbench.libInfo.name]?.engine || null;
        resetRender(workbench.wNode, sandbox, libEngine.current).then(() => {
          renderLayerCollection = collectionNodeSize(workbench.wNode, sandboxDocument);
          console.log('renderLayerCollection', renderLayerCollection);
          workbench.setRenderLayerInfo(renderLayerCollection);
        });
      });
      setReady(true);
    }
  }, [renderSandbox, ready]);

  return <Sandbox ref={renderSandbox} />;
};

CanvasRenderLayer.displayName = 'CanvasRenderLayer';

export default CanvasRenderLayer;
