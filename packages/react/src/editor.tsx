import * as componentsDeclare from './components/components.declare';

const FORM_ITEM_CONFIG_PROPERTIES = [
  {
    name: 'base',
    baseName: 'componentsBaseFormItemConfig',
  },
  {
    name: 'properties',
    baseName: '',
  },
  {
    name: 'styles',
    baseName: 'componentsStylesFormItemConfig',
  },
  {
    name: 'senior',
    baseName: 'componentsSeniorConfig',
  },
  {
    name: 'event',
    baseName: 'componentsEventsFormItemConfig',
  },
  {
    name: 'loop',
    baseName: 'componentsLoopConfig',
  },
];

// 根据组件的属性描述，获取属性操作菜单配置
const getComponentPropsFormItem = (props: any): Record<string, any> => {
  const formProperties: any = {};
  console.log('getComponentPropsFormItem', props);
  Object.keys(props).forEach((key) => {
    const { component = 'Input', ...itemProps } = props[key];
    formProperties[key] = {
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

// 根据导入配置和默认配置还有当前组件的配置输出编辑属性的具体配置信息
const generatorFormItemConfigProperties = (componentDeclare) => {
  return {
    ...componentDeclare,
    props: getComponentPropsFormItem(componentDeclare.props),
  };
};

// 根据组件DSL描述格式化出编辑器属性控制的配置信息
export const formatFormItemConfigByComponentDSL = (componentsDeclare) => {
  const componentNameList: string[] = Object.keys(componentsDeclare);
  const componentsFormItemConfig = {};
  componentNameList.forEach((d) => {
    const componentDeclare = componentsDeclare[d];
    if (!componentDeclare.name) return {};
    componentsFormItemConfig[componentDeclare.name] =
      generatorFormItemConfigProperties(componentDeclare);
  });
  return componentsFormItemConfig;
};

// 为编辑器提供组件库配置
export const libConfig = {
  componentsDeclare: formatFormItemConfigByComponentDSL(componentsDeclare),
};
