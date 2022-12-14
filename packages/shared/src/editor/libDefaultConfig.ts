const events = {
  type: 'void',
  title: '事件',
  'x-component': 'CollapseItem',
  properties: {
    'x-component-event': {
      type: 'array',
      'x-component': 'CEventsSetting',
    },
  },
};

const loop = {
  type: 'void',
  title: '循环系统',
  'x-component': 'CollapseItem',
  properties: {
    'x-component-data.loopDataSource': {
      type: 'object',
      'x-component': 'CLoopSetting',
    },
  },
};

const styles = {
  type: 'void',
  title: '样式',
  'x-component': 'CollapseItem',
  properties: {
    'style.width': {
      title: '宽度',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
    },
    'style.height': {
      title: '高度',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
    },
    'style.display': {
      title: '展示',
      'x-component': 'DisplayStyleSetter',
    },
    'style.background': {
      title: '背景',
      'x-component': 'BackgroundStyleSetter',
    },
    'style.font': {
      title: '字体',
      'x-component': 'FontStyleSetter',
    },
    'style.margin': {
      title: '外边距',
      'x-component': 'BoxStyleSetter',
      'x-component-props': {
        styleNamePrefix: 'margin',
      },
    },
    'style.padding': {
      title: '内边距',
      'x-component': 'BoxStyleSetter',
      'x-component-props': {
        styleNamePrefix: 'padding',
      },
    },
    'style.borderRadius': {
      title: '圆角',
      'x-component': 'BorderRadiusStyleSetter',
    },
    'style.border': {
      title: '边框',
      'x-component': 'BorderStyleSetter',
    },
  },
};

const base = {
  type: 'void',
  title: '基础属性',
  'x-component': 'CollapseItem',
  properties: {
    hidden: {
      title: '隐藏元素',
      'x-decorator': 'FormDataItem',
      type: 'boolean',
      'x-component': 'Switch',
    },
  },
};

const senior = {
  type: 'void',
  title: '高级设置',
  'x-component': 'CollapseItem',
  properties: {
    edit: {
      'x-component': 'CToEditChild',
    },
  },
};

export const DEFAULT_EDITOR_CONFIG = {
  base,
  styles,
  // events,
  // senior,
  // loop,
};
