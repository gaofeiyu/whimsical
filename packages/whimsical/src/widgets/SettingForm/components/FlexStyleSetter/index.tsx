import React from 'react';
import { Field, useField, observer } from '@formily/react';
import { Radio } from '@formily/antd';
import { usePrefix } from 'src/hooks';
import { InputItems } from '../InputItems';
import cls from 'classnames';
import Icon from '@ant-design/icons';
import EditorIcons from '../../icons';
import './styles.less';

export interface IFlexStyleSetterProps {
  className?: string;
  style?: React.CSSProperties;
}

export const FlexStyleSetter: React.FC<IFlexStyleSetterProps> = observer((props) => {
  const field = useField();
  const prefix = usePrefix('flex-style-setter');
  return (
    <div className={cls(prefix, props.className)} style={props.style}>
      <InputItems vertical>
        <Field
          name="flexDirection"
          basePath={field.address.parent()}
          dataSource={[
            {
              label: <Icon component={EditorIcons.FlexDirectionRow} />,
              value: 'row',
            },
            {
              label: <Icon component={EditorIcons.FlexDirectionColumn} />,
              value: 'column',
            },
          ]}
          reactions={(field) => {
            field.decorator[1].title = `Flex Direction : ${field.value || ''}`;
          }}
          decorator={[InputItems.Item]}
          component={[Radio.Group, { optionType: 'button' }]}
        />
        <Field
          name="flexWrap"
          basePath={field.address.parent()}
          dataSource={[
            {
              label: <Icon component={EditorIcons.FlexNoWrap} />,
              value: 'nowrap',
            },
            {
              label: <Icon component={EditorIcons.FlexWrap} />,
              value: 'wrap',
            },
          ]}
          reactions={(field) => {
            field.decorator[1].title = `Flex Wrap : ${field.value || ''}`;
          }}
          decorator={[InputItems.Item]}
          component={[Radio.Group, { optionType: 'button' }]}
        />
        <Field
          name="alignContent"
          basePath={field.address.parent()}
          dataSource={[
            {
              label: <Icon component={EditorIcons.FlexAlignContentCenter} />,
              value: 'center',
            },
            {
              label: <Icon component={EditorIcons.FlexAlignContentStart} />,
              value: 'flex-start',
            },
            {
              label: <Icon component={EditorIcons.FlexAlignContentEnd} />,
              value: 'flex-end',
            },
            {
              label: <Icon component={EditorIcons.FlexAlignContentSpaceAround} />,
              value: 'space-around',
            },
            {
              label: <Icon component={EditorIcons.FlexAlignContentSpaceBetween} />,
              value: 'space-between',
            },
            {
              label: <Icon component={EditorIcons.FlexAlignContentStretch} />,
              value: 'stretch',
            },
          ]}
          reactions={(field) => {
            field.decorator[1].title = `Align Content : ${field.value || ''}`;
          }}
          decorator={[InputItems.Item]}
          component={[Radio.Group, { optionType: 'button' }]}
        />
        <Field
          name="justifyContent"
          basePath={field.address.parent()}
          dataSource={[
            {
              label: <Icon component={EditorIcons.FlexJustifyCenter} />,
              value: 'center',
            },
            {
              label: <Icon component={EditorIcons.FlexJustifyStart} />,
              value: 'flex-start',
            },
            {
              label: <Icon component={EditorIcons.FlexJustifyEnd} />,
              value: 'flex-end',
            },
            {
              label: <Icon component={EditorIcons.FlexJustifySpaceAround} />,
              value: 'space-around',
            },
            {
              label: <Icon component={EditorIcons.FlexJustifySpaceBetween} />,
              value: 'space-between',
            },
            {
              label: <Icon component={EditorIcons.FlexJustifySpaceEvenly} />,
              value: 'space-evenly',
            },
          ]}
          reactions={(field) => {
            field.decorator[1].title = `Justify Content : ${field.value || ''}`;
          }}
          decorator={[InputItems.Item]}
          component={[Radio.Group, { optionType: 'button' }]}
        />
        <Field
          name="alignItems"
          basePath={field.address.parent()}
          dataSource={[
            {
              label: <Icon component={EditorIcons.RetFlexAlignItemsCenterurn} />,
              value: 'center',
            },
            {
              label: <Icon component={EditorIcons.FlexAlignItemsStart} />,
              value: 'flex-start',
            },
            {
              label: <Icon component={EditorIcons.FlexAlignItemsEnd} />,
              value: 'flex-end',
            },
            {
              label: <Icon component={EditorIcons.FlexAlignItemsStretch} />,
              value: 'stretch',
            },
            {
              label: <Icon component={EditorIcons.FlexAlignItemsBaseline} />,
              value: 'baseline',
            },
          ]}
          reactions={(field) => {
            field.decorator[1].title = `Align Items : ${field.value || ''}`;
          }}
          decorator={[InputItems.Item]}
          component={[Radio.Group, { optionType: 'button' }]}
        />
      </InputItems>
    </div>
  );
});
