import React from 'react';
import PanelTitle from './PanelTitle';

export type PanelProps = {
  title?: string;
  className?: string;
  children?: string | React.ReactNode;
  onClose?: () => void;
};

const Panel = (props: PanelProps) => {
  const { title, className = '', onClose = () => null } = props;

  return (
    <div className={`flex flex-col justify-start w-[600px] h-full border m-[-1px] ${className}`}>
      <PanelTitle title={title} onClose={onClose} />
      <div className="h-full overflow-auto">{props.children}</div>
    </div>
  );
};

Panel.displayName = 'Panel';

export default Panel;
