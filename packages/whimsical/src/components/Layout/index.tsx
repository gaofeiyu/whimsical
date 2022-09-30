import React from 'react';

export type LayoutProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const Layout = (props: LayoutProps) => {
  return <div className="flex flex-col w-full h-full">{props.children}</div>;
};

Layout.displayName = 'Layout';

export default Layout;
