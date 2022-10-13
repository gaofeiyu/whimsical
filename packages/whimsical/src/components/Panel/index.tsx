import React, { useMemo, useState } from 'react';
import PanelTitle from './PanelTitle';

export type PanelProps = {
  title?: string;
  className?: string;
  children?: string | React.ReactElement | React.ReactElement[];
  onClose?: () => void;
};

const Panel = (props: PanelProps) => {
  const { title, className = '', onClose = () => null } = props;

  return (
    <div className={`flex flex-col justify-start w-full h-full border m-[-1px] ${className}`}>
      <PanelTitle title={title} onClose={onClose} />
      <div>{props.children}</div>
    </div>
  );
};

Panel.displayName = 'Panel';

export default Panel;
