import { memo, forwardRef } from 'react';
import { ComponentLibInfoType, loadStatic } from 'whimsical-shared';

type CreateSandboxType = {
  renderSandbox: HTMLIFrameElement;
  componentInfo: ComponentLibInfoType;
};

type CreateSandboxResponseType = {
  lib: unknown;
  libEditor: unknown;
  libEngine: unknown;
};

export const createSandbox = (props: CreateSandboxType) => {
  const { renderSandbox, componentInfo } = props;
  const { name: componentLibName, resource = {} } = componentInfo;
  return new Promise<CreateSandboxResponseType>((resolve, reject) => {
    if (renderSandbox && renderSandbox.contentDocument && renderSandbox.contentWindow) {
      const iframeDocument: Document = renderSandbox.contentDocument;
      const iframeWindow: Window = renderSandbox.contentWindow;
      iframeDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>

        <style>
          html{
            overflow: overlay;
          }
          ::-webkit-scrollbar {
            width: 0;
            height: 0;
          }
          ::-webkit-scrollbar-thumb {
            border-radius: 0;
            transition: all .25s ease-in-out;
          }
          ::-webkit-scrollbar-thumb:hover {
          }
          body{
            margin:0;
            padding:0;
            overflow-anchor: none;
            user-select:none;
          }
          html{
            overflow-anchor: none;
          }
          .inherit-cusor * {
            cursor: inherit !important;
          }
        </style>
        </head>
        <body>
        </body>
        </html>
      `);
      iframeDocument.close();

      loadStatic({ resource, container: iframeDocument })
        .then(() => {
          const lib = iframeWindow[componentLibName] || null;
          const libEditor = iframeWindow[`${componentLibName}Editor`] || null;
          const libEngine = iframeWindow[`${componentLibName}Engine`] || null;
          resolve({
            lib: lib.default || lib,
            libEditor: libEditor.default || libEditor,
            libEngine: libEngine.default || libEngine,
          });
        })
        .catch((err) => {
          console.log('资源加载失败:', err);
          reject(err);
        });
    } else {
      resolve(null);
    }
  });
};

const Sandbox = forwardRef<HTMLIFrameElement>((props, ref) => {
  return (
    <iframe
      ref={ref}
      id="renderSandbox"
      className="absolute top-0 left-0 w-full h-full"
      {...props}
    ></iframe>
  );
});

Sandbox.displayName = 'Sandbox';

export default memo(Sandbox);
