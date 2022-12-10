import { HTMLAttributes } from 'react';

interface Props<T> extends HTMLAttributes<T> {
  children?: string;
}

const Link = (props: Props<unknown>) => {
  return <a {...props}>{props.children}</a>;
};

Link.displayName = 'Link';
export default Link;
