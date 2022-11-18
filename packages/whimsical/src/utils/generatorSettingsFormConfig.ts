import { ISchema } from '@formily/react';
import { IComponentDeclare, IComponentDeclareProp } from 'whimsical-shared';

// 根据组件的属性描述，获取属性操作菜单配置
export const getComponentPropsFormItem = (
  props: Record<string, IComponentDeclareProp>
): Record<string, ISchema> => {
  const componentPropKeys = Object.keys(props);
  return componentPropKeys.reduce((formProperties, key) => {
    const { component = 'Input', type, ...propConfig } = props[key];
    formProperties[`props.${key}`] = {
      type,
      'x-component': component,
      'x-decorator': 'FormItem',
      ...propConfig,
    };
    return formProperties;
  }, {});
};

export const generatorComponentsSettingsFormConfig = (componentsDeclare: IComponentDeclare) => {
  const componentKeys = Object.keys(componentsDeclare);

  return componentKeys.reduce((config, key) => {
    const componentDeclare = componentsDeclare[key];
    config[key] = getComponentPropsFormItem(componentDeclare.props);
    return config;
  }, {});
};
