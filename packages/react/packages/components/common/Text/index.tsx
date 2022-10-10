import { HTMLAttributes } from 'react';

interface Props<T> extends HTMLAttributes<T> {
  content?: string;
}

const Text = (props: Props<unknown>) => {
  const { content, ...newProps } = props;
  return <div {...newProps}>{content}</div>;
};

Text.displayName = 'Text';

export default Text;
