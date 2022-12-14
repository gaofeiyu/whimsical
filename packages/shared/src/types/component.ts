// 组件库相关静态资源配置
export type ComponentLibInfoResourceType = {
  dep?: {
    css?: string[];
    script?: string[];
  };
  component?: {
    css?: string[];
    script?: string[];
  };
  editor?: {
    css?: string[];
    script?: string[];
  };
  other?: {
    css?: string[];
    script?: string[];
  };
};

export type ComponentLibInfoType = {
  name: string;
  resource?: ComponentLibInfoResourceType;
};

export interface IComponentDeclareProp {
  type: string;
  title?: string;
  component?: string;
  decorator?: string;
  componentProps?: Record<string, unknown>;
  decoratorProps?: Record<string, unknown>;
}

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
  props?: Record<string, IComponentDeclareProp>;
  // Todo 组件在编辑器中的配置
  editor?: any;
}
