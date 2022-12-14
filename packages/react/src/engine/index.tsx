import { createRoot } from 'react-dom/client';
import { getDOMElement, registerComponents, IWBody } from 'whimsical-shared';
import './index.css';
import { WNodeRenderComponent, WView } from './WView';
import * as components from '../components';

// 注册组件
registerComponents(components);

export interface IWContainerRef {
  reload: () => void;
}

export const render = (
  wBody: IWBody,
  id?: string | HTMLElement | ShadowRoot,
  cb?: () => null,
  options = {
    editor: false,
    isPreview: false,
  }
) => {
  const callback = cb && typeof cb === 'function' ? cb : () => null;
  const element = getDOMElement(id);
  if (!element) {
    return {
      element,
    };
  }

  const root = createRoot(element);

  if (options.editor) {
    root.render(
      <>
        {options.isPreview ? (
          <WView wBody={wBody}></WView>
        ) : (
          WNodeRenderComponent(
            {
              wBody,
            },
            wBody
          )
        )}
      </>
    );
  } else {
    root.render(<WContainer wBody={wBody} empty={element?.innerHTML}></WContainer>);
  }

  // https://github.com/reactwg/react-18/discussions/5
  setTimeout(() => {
    callback();
  }, 0);
  return {
    element: root,
  };
};

export interface IWContainer {
  wBody: IWBody;
  empty: string | undefined;
}

export const WContainer = (props: IWContainer) => {
  const { wBody, empty } = props;
  return (
    <>
      {wBody ? (
        <WView wBody={wBody}></WView>
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: empty || '',
          }}
        ></div>
      )}
    </>
  );
};

export { default as generateNodeTree } from './generateNodeTree';
