import React from 'react';
import Panel from '../Panel';

type SidebarContentProps = {
  index?: number;
  children?: React.ReactNode[];
  title?: string;
  onClose?: () => void;
};

const SidebarContent = (props: SidebarContentProps) => {
  const { children, index = 0, title = '', onClose = () => null } = props;
  return (
    <Panel title={title} onClose={onClose}>
      {children[index] ? children[index] : null}
    </Panel>
  );
};

SidebarContent.displayName = 'SidebarContent';

export default SidebarContent;
