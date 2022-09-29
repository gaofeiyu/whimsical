import React from 'react';

export type ContentProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const Content = (props: ContentProps) => {
  return <>{props.children}</>;
};

Content.displayName = 'Content';

export default Content;
