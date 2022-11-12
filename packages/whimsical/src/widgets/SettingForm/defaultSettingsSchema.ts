export const settingsSchema = {
  type: 'object',
  properties: {
    'props.content': {
      type: 'string',
      title: '属性1',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {},
    },
    styles: {
      type: 'void',
      title: '样式',
      'x-component': 'CollapseItem',
      properties: {
        'style.width': {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'SizeInput',
        },
        'style.height': {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'SizeInput',
        },
        'style.visibility': {
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            options: [
              {
                label: '显示',
                value: 'visible',
              },
              {
                label: '隐藏',
                value: 'hidden',
              },
            ],
          },
        },
        'style.display': {
          'x-component': 'DisplayStyleSetter',
        },
        'style.background': {
          'x-component': 'BackgroundStyleSetter',
        },
        'style.font': {
          'x-component': 'FontStyleSetter',
        },
        'style.margin': {
          'x-component': 'BoxStyleSetter',
          'x-component-props': {
            styleNamePrefix: 'margin',
          },
        },
        'style.padding': {
          'x-component': 'BoxStyleSetter',
          'x-component-props': {
            styleNamePrefix: 'padding',
          },
        },
        'style.borderRadius': {
          'x-component': 'BorderRadiusStyleSetter',
        },
        'style.border': {
          'x-component': 'BorderStyleSetter',
        },
      },
    },
  },
};
