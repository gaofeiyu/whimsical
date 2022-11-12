import React from 'react';
import './styles.less';

export interface IInputItemsContext {
  width?: string | number;
  vertical?: boolean;
}

export interface IInputItemsProps {
  children: React.ReactElement | React.ReactElement[];
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  vertical?: boolean;
}

export interface IInputItemProps {
  children: React.ReactElement;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  width?: string | number;
  vertical?: boolean;
  title?: React.ReactNode;
}

const InputItemsContext = React.createContext<IInputItemsContext>(null);

export const InputItems: React.FC<IInputItemsProps> & {
  Item: React.FC<IInputItemProps>;
} = (props) => {
  return (
    <InputItemsContext.Provider value={props}>
      <div className={props.className} style={props.style}>
        {props.children}
      </div>
    </InputItemsContext.Provider>
  );
};

InputItems.defaultProps = {
  width: '100%',
};

InputItems.Item = (props) => {
  const prefix = 'input-items-item';
  return (
    <div className={props.className} style={{ width: props.width, ...props.style }}>
      {props.title && <div className={prefix + '-title'}>{props.title}</div>}
      <div className={prefix + '-controller'}>{props.children}</div>
    </div>
  );
};
