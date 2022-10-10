// 组件DSL描述
export interface IComponentDeclare {
  // 组件名称
  name?: string;
  // 中文名称
  cname?: string;
  // 组件类型
  type?: string;
  // 图片描述
  icon?: string;
  // 是否是行内元素
  inlineType?: boolean;
  // 是否是容器，即是否可以加入子元素
  isContainer?: boolean;
  // 组件可以传入的属性定义
  props?: Record<string, unknown>;
}
