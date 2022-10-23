import { memo, forwardRef } from 'react';

type CreateSandboxType = {
  renderSandboxDocument: Document;
};

export const createSandbox = (props: CreateSandboxType) => {
  const { renderSandboxDocument } = props;
  if (renderSandboxDocument) {
    renderSandboxDocument.write(`
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
    renderSandboxDocument.close();
  }
};

const Sandbox = forwardRef<HTMLIFrameElement>((props, ref) => {
  return (
    <iframe
      ref={ref}
      id="renderSandboxDocument"
      className="absolute top-0 left-0 w-full h-full"
      {...props}
    ></iframe>
  );
});

Sandbox.displayName = 'Sandbox';

export default memo(Sandbox);
