import { HTMLAttributes } from 'react';

interface Props<T> extends HTMLAttributes<T> {
  children?: string;
}

const View = (props: Props<unknown>) => {
  return <div {...props}>{props.children}</div>;
};

View.displayName = 'View';

export default View;
