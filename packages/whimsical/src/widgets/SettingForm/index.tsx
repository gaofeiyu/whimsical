import { createForm } from '@formily/core';
import { Form } from '@formily/antd';
import { SchemaField } from './SchemaField';
import './index.less';

const normalForm = createForm({
  validateFirst: true,
});

const normalSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: '属性1',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {},
    },
    password: {
      type: 'string',
      title: '属性2',
      'x-decorator': 'FormItem',
      'x-component': 'Password',
      'x-component-props': {},
    },
  },
};

export default () => {
  return (
    <Form form={normalForm} layout="vertical" size="large" onAutoSubmit={console.log}>
      <SchemaField schema={normalSchema} />
    </Form>
  );
};
