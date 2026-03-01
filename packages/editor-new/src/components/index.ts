import { componentRegistry } from '../registry/ComponentRegistry';
import { Button } from './Button';
import { Input } from './Input';
import { FlexBox } from './FlexBox';
import { Text } from './Text';
import { Page } from './Page';

export function registerBuiltInComponents() {
  componentRegistry.register({
    type: 'Page',
    name: '页面 (Page)',
    component: Page,
    isContainer: true,
    propsSchema: {
      backgroundColor: { type: 'color', label: '背景色', defaultValue: '#ffffff' },
      padding: { type: 'string', label: '内边距', defaultValue: '20px' },
      margin: { type: 'string', label: '外边距', defaultValue: '0' },
    },
    defaultProps: {
      backgroundColor: '#ffffff',
      padding: '20px',
      margin: '0',
    }
  });

  componentRegistry.register({
    type: 'Button',
    name: '按钮 (Button)',
    component: Button,
    propsSchema: {
      text: { type: 'string', label: '文本', defaultValue: '按钮' },
      color: { type: 'color', label: '文字颜色', defaultValue: '#ffffff' },
      backgroundColor: { type: 'color', label: '背景色', defaultValue: '#1890ff' },
      padding: { type: 'string', label: '内边距', defaultValue: '8px 16px' },
    },
    defaultProps: {
      text: '按钮',
      color: '#ffffff',
      backgroundColor: '#1890ff',
      padding: '8px 16px',
    }
  });

  componentRegistry.register({
    type: 'Input',
    name: '输入框 (Input)',
    component: Input,
    propsSchema: {
      placeholder: { type: 'string', label: '占位提示', defaultValue: '请输入...' },
      width: { type: 'string', label: '宽度', defaultValue: '100%' },
      padding: { type: 'string', label: '内边距', defaultValue: '8px' },
      border: { type: 'string', label: '边框', defaultValue: '1px solid #d9d9d9' },
    },
    defaultProps: {
      placeholder: '请输入...',
      width: '100%',
      padding: '8px',
      border: '1px solid #d9d9d9',
    }
  });

  componentRegistry.register({
    type: 'FlexBox',
    name: '弹性容器 (FlexBox)',
    component: FlexBox,
    isContainer: true,
    propsSchema: {
      direction: {
        type: 'select',
        label: '方向',
        defaultValue: 'row',
        options: [
          { label: '水平 (Row)', value: 'row' },
          { label: '垂直 (Column)', value: 'column' }
        ]
      },
      justifyContent: {
        type: 'select',
        label: '主轴对齐',
        defaultValue: 'flex-start',
        options: [
          { label: '起点', value: 'flex-start' },
          { label: '居中', value: 'center' },
          { label: '终点', value: 'flex-end' },
          { label: '两端对齐', value: 'space-between' },
          { label: '环绕', value: 'space-around' },
        ]
      },
      alignItems: {
        type: 'select',
        label: '交叉轴对齐',
        defaultValue: 'stretch',
        options: [
          { label: '拉伸', value: 'stretch' },
          { label: '起点', value: 'flex-start' },
          { label: '居中', value: 'center' },
          { label: '终点', value: 'flex-end' },
        ]
      },
      padding: { type: 'string', label: '内边距', defaultValue: '10px' },
      margin: { type: 'string', label: '外边距', defaultValue: '0' },
      border: { type: 'string', label: '边框', defaultValue: '1px dashed #ccc' },
    },
    defaultProps: {
      direction: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      padding: '10px',
      margin: '0',
      border: '1px dashed #ccc',
    }
  });

  componentRegistry.register({
    type: 'Text',
    name: '文本 (Text)',
    component: Text,
    propsSchema: {
      content: { type: 'string', label: '内容', defaultValue: '一段文本' },
      color: { type: 'color', label: '颜色', defaultValue: '#333333' },
      fontSize: { type: 'string', label: '字号', defaultValue: '14px' },
      fontWeight: {
        type: 'select',
        label: '字重',
        defaultValue: 'normal',
        options: [
          { label: '正常 (Normal)', value: 'normal' },
          { label: '加粗 (Bold)', value: 'bold' }
        ]
      },
      textAlign: {
        type: 'select',
        label: '对齐方式',
        defaultValue: 'left',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' },
        ]
      }
    },
    defaultProps: {
      content: '一段文本',
      color: '#333333',
      fontSize: '14px',
      fontWeight: 'normal',
      textAlign: 'left',
    }
  });
}