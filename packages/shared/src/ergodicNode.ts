import { IWNode } from 'whimsical-shared';

export interface IErgodicNodeCallbackProps<T, P> {
  // 当前节点信息
  currentNode: T;
  // 父级节点信息
  parentNode?: T;
  // 子节点的结果集合
  children?: IErgodicNode<P>[];
  // 当前节点的渲染id
  nodeRenderId?: string;
  // 父级节点的渲染id
  parentRenderId?: string;
  // 当前节点是否是循环节点（被设置循环数据的节点）
  isLoopNode?: boolean;
}

export type NodeBaseType<T> = {
  id: string;
  children: T[];
  name?: string;
};

export interface IErgodicNodeProps<T, P> {
  // 节点信息
  node: T;
  // 父级节点信息，如果没有父级则为undefined
  parentNode?: T;
  // 父级节点id
  parentRenderId?: string;
  // 当前节点在嵌套中的路径以"0-2-1"的方式进行存储
  path?: string;
  // 获取当前需要操作的节点信息
  covertNodeBase?: <T>(node: T) => NodeBaseType<T>;
  // 节点遍历回调，用来对当前节点进行相关操作
  callback?: (props: IErgodicNodeCallbackProps<T, P>) => P;
}

export interface IErgodicNode<P> {
  // 节点id
  id?: string;
  // 子节点返回信息
  children?: IErgodicNode<P>[];
  // 通过遍历的callback返回的值
  value?: P;
  name?: string;
}

/**
 * 节点遍历
 * @param props IErgodicNodeProps
 * @returns IErgodicNode
 */

export function ergodicNode<T = IWNode, P = any>(
  props: IErgodicNodeProps<T, P>
): IErgodicNode<P>[] {
  const { node, parentNode, parentRenderId, path = '', covertNodeBase, callback } = props;
  /**
   * TODO 我想要的是下面这行的效果，但是在新版本的ts里面这里报错了，搞半天没改过来，搞明白了再弄
   * if (!(node as NodeBaseType<T>).id || !(node as NodeBaseType<T>).name) return [];
   * Infomation
   * error TS2352: Conversion of type 'T' to type 'NodeBaseType<T>' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
   */
  if (!(node as any).id || !(node as any).name) return [];
  const {
    id: nodeId,
    children: nodeChildren,
    name: nodeName = '',
  } = covertNodeBase ? covertNodeBase(node) : (node as any);
  const nodeRenderId = path === '' ? `${nodeId}` : `${nodeId}-${path}`;
  let children: IErgodicNode<P>[] | undefined;
  if (nodeChildren) {
    children = [];
    nodeChildren.forEach((childNode: T) => {
      const value: IErgodicNode<P>[] = ergodicNode({
        node: childNode,
        parentNode: node,
        path,
        parentRenderId: nodeRenderId,
        covertNodeBase,
        callback,
      });
      if (children) {
        children.splice(children.length, 0, ...value);
      }
    });
  }
  return [
    {
      id: nodeId,
      children,
      name: nodeName,
      value: callback
        ? callback({
            currentNode: node,
            parentNode,
            children,
            parentRenderId,
            nodeRenderId,
          })
        : undefined,
    },
  ];
}
