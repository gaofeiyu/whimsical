import { ReactElement, useEffect, useState, useContext, useRef } from 'react';
import { IWNode, loadStatic } from 'whimsical-shared';
import Sandbox, { createSandbox } from './Sandbox';
import { WorkbenchContext } from 'src/pages/playground/context';
import { collectionNodeSize } from './collectionNodeSize';
import { IRenderLayerTree } from './renderLayer';
import { EDITOR_EVENTS$ } from 'src/editor-flow';

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
        const renderRootEle = sandboxDocument.getElementById('renderRoot');
        if (renderRootEle) {
          renderRootEle.remove();
        }
        sandboxBody.prepend(renderRoot);
        console.log('render after', renderRoot);
        setTimeout(() => {
          resolve(renderRoot);
        }, 0);
      });
    });
  } else {
    console.debug('NO_LIB_ENGINE', libEngine, sandbox);
    return Promise.reject('NO_LIB_ENGINE');
  }
};

const CanvasRenderLayer = () => {
  const workbench = useContext(WorkbenchContext);
  const { LibInfo } = workbench;
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
        resource: LibInfo?.resource,
        container: sandboxDocument,
      }).then(() => {
        const lib = window[`${LibInfo.name}`].default || window[`${LibInfo.name}`];
        if (!lib) return;
        LibInfo.setComponentsDeclare(lib?.editor?.libConfig?.componentsDeclare);
        LibInfo.setEngine(lib?.editor);
        libEngine.current = sandbox.contentWindow[workbench.LibInfo.name]?.engine || null;
        EDITOR_EVENTS$.emit('canvas:ready');
        setReady(true);
      });
    }
  }, [renderSandbox, ready]);

  useEffect(() => {
    if (!EDITOR_EVENTS$) return;
    const eventRemove = EDITOR_EVENTS$.on(
      [
        'node:prepend',
        'node:append',
        'node:insertAfter',
        'node:insertBefore',
        'node:remove',
        'props:update',
        'canvas:ready',
        'canvas:resize',
        'history:goto',
      ],
      (e) => {
        const sandbox = renderSandbox.current;
        const sandboxDocument = sandbox?.contentDocument;
        const wNode = workbench.treeNode.serialize();
        console.log('new wNode ready to render', e.type, wNode);
        resetRender(wNode, sandbox, libEngine.current).then(() => {
          renderLayerCollection = collectionNodeSize(wNode, sandboxDocument);
          console.log('renderLayerCollection', renderLayerCollection);
          workbench.setWNode(wNode);
          workbench.setRenderLayerInfo(renderLayerCollection);
        });
      }
    );
    return () => {
      eventRemove();
    };
  }, []);

  return <Sandbox ref={renderSandbox} />;
};

CanvasRenderLayer.displayName = 'CanvasRenderLayer';

export default CanvasRenderLayer;
