export interface IWExpression {
  type: string;
  value?: string | IWExpression;
  params?: Record<string, unknown> | IWExpression;
}

export interface IWActionExpression extends IWExpression {
  type: 'Action';
  actionName: string | IWExpression;
  success: IWActionExpression[];
  fail: IWActionExpression[];
  finally: IWActionExpression[];
}

export type WDataSourceEnum = 'API' | 'Store' | 'LoopState';

export interface IWDataSourceExpression extends IWExpression {
  type: WDataSourceEnum;
}

/**
 * Event类型声明
 */
export type EventExpressionType = {
  name: string;
  action?: IWActionExpression[];
};

// 节点数据
export type WNodeDataType = {
  loopDataSource?: IWDataSourceExpression;
};

// 节点DSL
export interface IWNode {
  id: string;
  name: string;
  type?: string;
  aliasId?: string;
  children?: IWNode[];
  style?: Record<string, unknown | IWExpression>;
  props?: Record<string, unknown | IWExpression>;
  events?: EventExpressionType[];
  data?: WNodeDataType;
  hidden?: boolean | IWExpression;
}
