import React from 'react';
import { createSchemaField } from '@formily/react';
import { FormItem, Input, Password } from '@formily/antd';
import * as ICONS from '@ant-design/icons';
import { InputItems } from '../SettingComponents';

export const SchemaField = createSchemaField({
  components: {
    FormItem,
    InputItems,
    Input,
    Password,
  },
  scope: {
    icon(name) {
      return React.createElement(ICONS[name]);
    },
  },
});
