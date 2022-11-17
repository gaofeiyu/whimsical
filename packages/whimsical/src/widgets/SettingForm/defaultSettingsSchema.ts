export const settingsSchema = {
  type: 'object',
  properties: {
    props: {
      type: 'void',
      title: '属性',
      'x-component': 'CollapseItem',
      properties: {},
    },
    styles: {
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
    },
  },
};
