import React, { useState } from 'react';
import { useField, observer } from '@formily/react';
import { usePrefix } from 'src/hooks';
import cls from 'classnames';
import './styles.less';
import { RightOutlined } from '@ant-design/icons';

export interface ICollapseItemProps {
  className?: string;
  style?: React.CSSProperties;
  defaultExpand?: boolean;
}

export const CollapseItem: React.FC<ICollapseItemProps> = observer((props) => {
  const prefix = usePrefix('collapse-item');
  const field = useField();
  const [expand, setExpand] = useState(props.defaultExpand ?? true);
  return (
    <div className={cls(prefix, props.className, { expand })} style={props.style}>
      <div
        className={prefix + '-header'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setExpand(!expand);
        }}
      >
        <div className={prefix + '-header-expand'}>
          <RightOutlined />
        </div>
        <div className={prefix + '-header-content'}>{field.title}</div>
      </div>
      <div className={prefix + '-content'}>{props.children}</div>
    </div>
  );
});
