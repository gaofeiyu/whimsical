export interface IErgodicNodeCallbackProps<T, P> {
  // 当前节点信息
  currentNode: T;
  // 父级节点信息
  parentNode?: T;
  // 子节点的结果集合
  children: IErgodicNode<P>[];
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

export function ergodicNode<T, P>(props: IErgodicNodeProps<T, P>): IErgodicNode<P>[] {
  const { node, parentNode, parentRenderId = '', path = '', covertNodeBase, callback } = props;
  const {
    id: nodeId,
    children: nodeChildren,
    name: nodeName = '',
  } = covertNodeBase ? covertNodeBase(node) : (node as NodeBaseType<T>);
  const nodeRenderId = path === '' ? `${nodeId}` : `${nodeId}-${path}`;
  const children: IErgodicNode<P>[] = [];
  nodeChildren.forEach((childNode: T) => {
    const value: IErgodicNode<P>[] = ergodicNode({
      node: childNode,
      parentNode: node,
      path,
      parentRenderId: nodeRenderId,
      covertNodeBase,
      callback,
    });
    children.splice(children.length, 0, ...value);
  });
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
