import React, { ForwardedRef, useCallback, useImperativeHandle, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { IWNode, getDOMElement } from 'whimsical-shared';
import './index.css';
import { WView } from './WView';

export interface IWContainerRef {
  reload: () => void;
}

export const render = (
  node: IWNode,
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
    root.render(<>{options.isPreview ? <WView node={node}></WView> : null}</>);
  } else {
    root.render(<WContainer node={node} empty={element?.innerHTML}></WContainer>);
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
  node: IWNode;
  empty: string | undefined;
}

export const WContainer = (props: IWContainer) => {
  const { node, empty } = props;

  return (
    <>
      {node ? (
        <WView node={node}></WView>
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
