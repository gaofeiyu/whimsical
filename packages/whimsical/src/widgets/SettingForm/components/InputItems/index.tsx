import React, { isValidElement, ReactNode, useContext, useMemo } from 'react';
import { usePrefix } from 'src/hooks';
import Icon from '@ant-design/icons';
import EditorIcons from '../../icons';
import cls from 'classnames';
import './styles.less';

export interface IInputItemsContext {
  width?: string | number;
  vertical?: boolean;
}

export interface IInputItemsProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  vertical?: boolean;
}

export interface IInputItemProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  icon?: string | React.FC<React.SVGProps<SVGSVGElement>> | React.ReactNode;
  width?: string | number;
  vertical?: boolean;
  title?: React.ReactNode;
}

const InputItemsContext = React.createContext<IInputItemsContext>(null);

export const InputItems: React.FC<IInputItemsProps> & {
  Item: React.FC<IInputItemProps>;
} = (props) => {
  const prefix = usePrefix('input-items');
  return (
    <InputItemsContext.Provider value={props}>
      <div className={cls(prefix, props.className)} style={props.style}>
        {props.children}
      </div>
    </InputItemsContext.Provider>
  );
};

InputItems.defaultProps = {
  width: '100%',
};

InputItems.Item = (props) => {
  const prefix = usePrefix('input-items-item');
  const ctx = useContext(InputItemsContext);
  const icon = useMemo(() => {
    if (isValidElement(props.icon)) {
      return props.icon;
    }
    if (typeof props.icon === 'string' && EditorIcons[props.icon]) {
      return EditorIcons[props.icon];
    }
    return <></>;
  }, [props.icon]);
  return (
    <div
      className={cls(prefix, props.className, {
        vertical: props.vertical || ctx.vertical,
      })}
      style={{ width: props.width || ctx.width, ...props.style }}
    >
      {props.icon && <div className={prefix + '-icon'}>{icon as ReactNode}</div>}
      {props.title && <div className={prefix + '-title'}>{props.title}</div>}
      <div className={prefix + '-controller'}>{props.children}</div>
    </div>
  );
};
