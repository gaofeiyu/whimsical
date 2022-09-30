import React from 'react';

export type ContentProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const Content = (props: ContentProps) => {
  return <div className="flex flex-auto">{props.children}</div>;
};

Content.displayName = 'Content';

export default Content;
