import React, { useEffect, useMemo } from 'react';
import Panel from '../Panel';

type SidebarContentProps = {
  index?: number;
  children?: React.ReactNode[];
  title?: string;
  onClose?: () => void;
};

let contentCache = [];

const SidebarContent = (props: SidebarContentProps) => {
  const { children, index = 0, title = '', onClose = () => null } = props;
  useEffect(() => {
    contentCache = new Array(children.length);
  }, [children]);
  const content = useMemo(() => {
    if (!contentCache[index]) {
      contentCache[index] = (
        <Panel title={title} onClose={onClose}>
          {children[index] ? children[index] : null}
        </Panel>
      );
    }
    return contentCache[index];
  }, [children, index]);
  return <>{content}</>;
};

SidebarContent.displayName = 'SidebarContent';

export default SidebarContent;
