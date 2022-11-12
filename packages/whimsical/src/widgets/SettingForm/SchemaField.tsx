import React from 'react';
import { createSchemaField } from '@formily/react';
import * as ICONS from '@ant-design/icons';

import {
  FormItem,
  Input,
  NumberPicker,
  DatePicker,
  TimePicker,
  Select,
  Radio,
  Switch,
  Space,
  ArrayItems,
  ArrayTable,
  FormCollapse,
  FormLayout,
  FormTab,
} from '@formily/antd';

import {
  SizeInput,
  ColorInput,
  ImageInput,
  BackgroundImageInput,
  PositionInput,
  CornerInput,
  ValueInput,
  BoxStyleSetter,
  BorderStyleSetter,
  BorderRadiusStyleSetter,
  BackgroundStyleSetter,
  BoxShadowStyleSetter,
  FontStyleSetter,
  DisplayStyleSetter,
  FlexStyleSetter,
  DrawerSetter,
  CollapseItem,
} from './components';

export const SchemaField = createSchemaField({
  components: {
    // antd
    FormItem,
    Input,
    NumberPicker,
    DatePicker,
    TimePicker,
    Select,
    Radio,
    Switch,
    Space,
    ArrayItems,
    ArrayTable,
    FormCollapse,
    FormLayout,
    FormTab,
    // Editor
    SizeInput,
    ColorInput,
    ImageInput,
    BackgroundImageInput,
    PositionInput,
    CornerInput,
    ValueInput,
    BoxStyleSetter,
    BorderStyleSetter,
    BorderRadiusStyleSetter,
    BackgroundStyleSetter,
    BoxShadowStyleSetter,
    FontStyleSetter,
    DisplayStyleSetter,
    FlexStyleSetter,
    DrawerSetter,
    CollapseItem,
  },
  scope: {
    icon(name) {
      return React.createElement(ICONS[name]);
    },
  },
});
