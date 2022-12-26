# 节点描述

## 类型声明
```
interface IWNode {
  // 组件id
  id: string;
  // 组件名称
  name: string;
  // 组件类型
  type?: string;
  // 组件id别名
  aliasId?: string;
  // 子节点
  children?: IWNode[];
  // 节点样式
  style?: Record<string, unknown | IWExpression>;
  // 节点属性
  props?: Record<string, unknown | IWExpression>;
  // 节点绑定的事件
  events?: EventExpressionType[];
  // 节点绑定的数据，当前仅包含循环数据声明
  data?: WNodeDataType;
  // 节点是否隐藏，true为隐藏，默认为false
  hidden?: boolean | IWExpression;
}
```
## 示例
```
{
  name: 'Image',
  id: '123',
  child: [],
  style: {},
  props: {
  },
  data: {
    // 循环节点设置，只能是选择array的元素作为loop的值，且只能选择一个
    loopDataSource: {
      type: 'Api | Store',
      value: 'api.apiName.arrayField'
    }
  },
  events: []
}
```
