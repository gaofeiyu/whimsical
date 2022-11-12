import React from 'react';
import { useField, Field, observer } from '@formily/react';
import { Field as FieldType } from '@formily/core';
import { FormItem } from '@formily/antd';
import { Radio } from 'antd';
import { usePrefix } from 'src/hooks';
import Icon from '@ant-design/icons';
import EditorIcons from '../../icons';
import { FlexStyleSetter } from '../FlexStyleSetter';
import cls from 'classnames';
import './styles.less';

export interface IDisplayStyleSetterProps {
  className?: string;
  style?: React.CSSProperties;
  value?: string;
  onChange?: (value: string) => void;
}

export const DisplayStyleSetter: React.FC<IDisplayStyleSetterProps> = observer((props) => {
  const field = useField<FieldType>();
  const prefix = usePrefix('display-style-setter');
  return (
    <>
      <FormItem.BaseItem
        label={field.title}
        className={cls(prefix, props.className)}
        style={props.style}
      >
        <Radio.Group
          className={prefix + '-radio'}
          options={[
            {
              label: <Icon component={EditorIcons.DisplayBlock} />,
              value: 'block',
            },
            {
              label: <Icon component={EditorIcons.DisplayInlineBlock} />,
              value: 'inline-block',
            },
            {
              label: <Icon component={EditorIcons.DisplayInline} />,
              value: 'inline',
            },
            {
              label: <Icon component={EditorIcons.DisplayFlex} />,
              value: 'flex',
            },
          ]}
          value={props.value}
          onChange={(e) => {
            props.onChange?.(e.target.value);
          }}
          optionType="button"
        />
      </FormItem.BaseItem>
      <Field
        name="flex"
        basePath={field.address.parent()}
        visible={false}
        reactions={(flexField) => {
          flexField.visible = field.value === 'flex';
        }}
        component={[FlexStyleSetter]}
      />
    </>
  );
});
