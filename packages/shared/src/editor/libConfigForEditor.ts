import { IComponentDeclare } from '../types';
import { DEFAULT_EDITOR_CONFIG } from './libDefaultConfig';

// 根据组件的属性描述，获取属性操作菜单配置
const getComponentPropsFormItem = (props: any): Record<string, any> => {
  const formProperties: any = {};
  console.log('getComponentPropsFormItem', props);
  Object.keys(props).forEach((key) => {
    const { component = 'Input', ...itemProps } = props[key];
    formProperties[`props.${key}`] = {
      type: props[key].type,
      'x-decorator': 'FormDataItem',
      'x-component': component,
      ...itemProps,
      'x-decorator-props': {
        valueType: props[key].type,
      },
      display: true,
    };
  });
  console.log('formProperties', formProperties);
  return formProperties;
};

const getComponentEditorConfig = (
  componentDeclare: IComponentDeclare,
  options?: ILibConfigOptions
) => {
  const { defaultEditorConfig = {} } = options || {};
  const properties = {
    type: 'void',
    'x-component': 'CollapseItem',
    title: `字段属性`,
    properties: getComponentPropsFormItem(componentDeclare.props),
  };
  return {
    type: 'object',
    properties: {
      properties,
      ...defaultEditorConfig,
    },
  };
};

interface ILibConfigOptions {
  defaultEditorConfig: any;
}

// 根据组件DSL描述格式化出编辑器属性控制的配置信息
export const formatLibConfig = (
  componentsDeclare: Record<string, IComponentDeclare>,
  options?: ILibConfigOptions
) => {
  const componentNameList: string[] = Object.keys(componentsDeclare);
  const { defaultEditorConfig = DEFAULT_EDITOR_CONFIG } = options || {};
  const libConfig = {};
  componentNameList.forEach((componentName) => {
    const componentDeclare = componentsDeclare[componentName];
    if (componentDeclare.name) {
      libConfig[componentDeclare.name] = {
        ...componentDeclare,
        editor: getComponentEditorConfig(componentDeclare, {
          defaultEditorConfig,
        }),
      };
    }
  });
  return libConfig;
};
