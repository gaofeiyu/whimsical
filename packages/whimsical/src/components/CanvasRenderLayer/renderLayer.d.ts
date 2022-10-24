// 渲染层布局信息
export interface IRenderLayerItemRect {
  width?: string | number;
  height?: string | number;
  transform?: string;
  position?: string;
  overflow?: string;
}

// 渲染层元素布局信息详情
export interface IRenderLayerItem {
  children?: {
    [key: string]: RenderLayerNodeMapNodeProps;
  };
  style?: RenderLayerElementRectProps;
  selectionBoxStyle?: RenderLayerElementRectProps;
  hidden?: boolean;
}

// 渲染层元素及布局信息映射
export interface IRenderLayerTree {
  [key: string]: IRenderLayerItem;
}
