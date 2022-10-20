import { IWNode } from 'whimsical-shared';
import './index.css';

export const render = (
  wNode: IWNode,
  id?: string | HTMLElement | ShadowRoot,
  cb?: () => null,
  options?: any
) => {
  const { reload = false } = options || {};
  const callback = cb && typeof cb === 'function' ? cb : () => null;
  const result = null;
  let element = id as HTMLElement | null;
  if (typeof id === 'string') {
    element = document.getElementById(id);
  }
  console.log(wNode, element);
  if (reload) {
    callback();
  }
  return result;
};

// 组件
export * as components from './components';
