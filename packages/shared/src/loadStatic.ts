import { ComponentLibInfoResourceType } from './types';

type PromiseItemType = Promise<any> | (() => any) | undefined;
export const syncPromise = (
  promiseList: PromiseItemType[],
  index = 0,
  callback = (_value?: any) => null
): Promise<any> => {
  if (!promiseList[index])
    return new Promise<void>((resolve) => {
      resolve();
    });
  const promiseItem: PromiseItemType = promiseList[index];
  if (typeof promiseItem === 'function') {
    const promiseItemResult = promiseItem();
    if ((promiseItemResult as any) instanceof Promise) {
      return promiseItemResult.then((res: any) => {
        callback(res);
        return syncPromise(promiseList, index + 1);
      });
    }
  }

  return syncPromise(promiseList, index + 1);
};

export const asyncPromise = (
  promiseList: PromiseItemType[],
  callback = (_value?: any) => null
): Promise<any> => {
  const promiseTotalCount = promiseList.length;
  let promiseCount = 0;
  return new Promise((resolve, reject) => {
    function promisesFinally(res?: any) {
      promiseCount++;
      callback(res);
      if (promiseCount >= promiseTotalCount) {
        resolve(null);
      }
    }

    promiseList.forEach((promiseItem: PromiseItemType) => {
      if (!promiseItem || typeof promiseItem !== 'function') {
        promisesFinally(promiseItem);
      } else {
        const promiseItemResult = promiseItem();
        if ((promiseItemResult as any) instanceof Promise) {
          promiseItemResult
            .then((res: any) => {
              promisesFinally(res);
            })
            .catch((err: Error) => {
              reject(err);
            });
        }
      }
    });
  });
};

export function loadScript(src: string, container: Document) {
  return () => {
    return new Promise((resolve, reject) => {
      const resource = container.createElement('script');
      resource.type = 'text/javascript';
      resource.async = false;
      resource.src = src;
      resource.onload = (e) => {
        // 输出资源加载情况
        console.log('onload:', src);
        resolve(e);
      };
      resource.onerror = reject;
      container.head.appendChild(resource);
    });
  };
}

export function loadCSS(src: string, container: Document) {
  return () => {
    return new Promise((resolve, reject) => {
      const resource = container.createElement('link');
      resource.rel = 'stylesheet';
      resource.href = src;
      resource.onload = resolve;
      resource.onerror = reject;
      container.head.appendChild(resource);
    });
  };
}

export interface loadStaticProps {
  resource: ComponentLibInfoResourceType;
  container?: Document;
  async?: boolean;
  ignoreResource?: string[];
}

const getNeedLoadStatic = (
  resource: ComponentLibInfoResourceType,
  ignoreResource = [] as string[]
): [string[] | null, string[] | null] => {
  const keys = Object.keys(resource);
  if (!keys || !keys.length) return [null, null];
  const script: string[] = [];
  const css: string[] = [];
  keys.forEach((key) => {
    if (ignoreResource.includes(key)) return;
    script.splice(script.length - 1, 0, ...resource[key].script);
    css.splice(css.length - 1, 0, ...resource[key].css);
  });
  return [[...new Set(script)], [...new Set(css)]];
};

export function loadStatic(config: loadStaticProps) {
  const { resource = {}, container = document, ignoreResource = [], async = false } = config;
  let scriptPromiseList: PromiseItemType[] = [];
  let cssPromiseList: PromiseItemType[] = [];
  const [script, css] = getNeedLoadStatic(resource, ignoreResource);
  if (script && script.length) {
    scriptPromiseList = script.map((item: string) => loadScript(item, container));
  }
  if (css && css.length) {
    cssPromiseList = css.map((item: string) => loadCSS(item, container));
  }
  return async
    ? asyncPromise([...cssPromiseList, ...scriptPromiseList], () => null)
    : syncPromise([...cssPromiseList, ...scriptPromiseList]);
}
