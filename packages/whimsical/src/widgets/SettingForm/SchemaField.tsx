import React from 'react';
import { createSchemaField } from '@formily/react';
import { FormItem, Input } from '@formily/antd';
import * as ICONS from '@ant-design/icons';
import { InputItems, CollapseItem } from '../SettingComponents';

export const SchemaField = createSchemaField({
  components: {
    FormItem,
    InputItems,
    Input,
    CollapseItem,
  },
  scope: {
    icon(name) {
      return React.createElement(ICONS[name]);
    },
  },
});
