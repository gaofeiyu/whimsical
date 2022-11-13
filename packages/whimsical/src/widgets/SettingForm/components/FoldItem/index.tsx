import React, { useRef } from 'react';
import { action, observable } from 'mobx';
import { FormItem, IFormItemProps } from '@formily/antd';
import { useField } from '@formily/react';
import { usePrefix } from 'src/hooks';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import Icon from '@ant-design/icons';
import EditorIcons from '../../icons';
import './styles.less';

const ExpandedMap = observable(new Map<string, boolean>());

export const FoldItem: React.FC<
  IFormItemProps & {
    children?: React.ReactNode;
  }
> & {
  Base?: React.FC<{
    children?: React.ReactNode;
  }>;
  Extra?: React.FC<{
    children?: React.ReactNode;
  }>;
} = observer(({ className, children, ...props }) => {
  const prefix = usePrefix('fold-item');
  const field = useField();
  console.log('field', field, props);
  const expand = ExpandedMap.get(field.address.toString());
  const slots = useRef({ base: null, extra: null });
  React.Children.forEach(children, (node) => {
    if (React.isValidElement(node)) {
      if (node?.['type']?.['displayName'] === 'FoldItem.Base') {
        slots.current.base = node['props'].children;
      }
      if (node?.['type']?.['displayName'] === 'FoldItem.Extra') {
        slots.current.extra = node['props'].children;
      }
    }
  });
  return (
    <div className={cls(prefix, className)}>
      <div
        className={prefix + '-base'}
        onClick={action(() => {
          ExpandedMap.set(field.address.toString(), !expand);
        })}
      >
        <FormItem.BaseItem
          {...props}
          label={
            <span
              className={cls(prefix + '-title', {
                expand,
              })}
            >
              {slots.current.extra && (
                <Icon className={cls(prefix + '-icon')} component={EditorIcons.Expand} />
              )}
              {props.label}
            </span>
          }
        >
          <div
            style={{ width: '100%' }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {slots.current.base}
          </div>
        </FormItem.BaseItem>
      </div>
      {expand && slots.current.extra && (
        <div className={prefix + '-extra'}>{slots.current.extra}</div>
      )}
    </div>
  );
});

const Base: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

Base.displayName = 'FoldItem.Base';

const Extra: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

Extra.displayName = 'FoldItem.Extra';

FoldItem.Base = Base;
FoldItem.Extra = Extra;
