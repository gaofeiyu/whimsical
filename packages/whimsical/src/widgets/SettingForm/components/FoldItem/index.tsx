import React, { Fragment, useRef, useMemo } from 'react';
import { observable } from 'mobx';
import { FormItem, IFormItemProps } from '@formily/antd';
import { useField } from '@formily/react';
import { usePrefix } from 'src/hooks';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import { DownOutlined } from '@ant-design/icons';
import './styles.less';

const ExpandedMap = new Map<string, boolean>();

observable.ref(ExpandedMap, 'ExpandedMap');

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
  const expand = useMemo(() => ExpandedMap.get(field.address.toString()), []);
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
        onClick={() => {
          ExpandedMap.set(field.address.toString(), !expand);
        }}
      >
        <FormItem.BaseItem
          {...props}
          label={
            <span
              className={cls(prefix + '-title', {
                expand,
              })}
            >
              {slots.current.extra && <DownOutlined />}
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
