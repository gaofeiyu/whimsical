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
        componentInfo: {
          name: 'test',
          resource: {
            component: {
              sctript: ['http://127.0.0.1:8070/WReactEngine.umd.js'],
              css: ['http://127.0.0.1:8070/style.css'],
            },
            editor: {
              sctript: ['http://127.0.0.1:8070/WReactEditor.umd.js'],
            },
          },
        },
      }).then(({ lib, libEditor, libEngine }) => {
        const componentLib = lib
          ? lib
          : {
              editor: libEditor,
              engine: libEngine,
            };

        console.log(componentLib);
      });
    }
  }, [renderSandbox, ready]);

  return <Sandbox ref={renderSandbox} />;
};

CanvasRenderLayer.displayName = 'CanvasRenderLayer';

export default CanvasRenderLayer;
