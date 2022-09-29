import React from 'react';

export type LayoutProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const Layout = (props: LayoutProps) => {
  return <>{props.children}</>;
};

Layout.displayName = 'Layout';

export default Layout;
