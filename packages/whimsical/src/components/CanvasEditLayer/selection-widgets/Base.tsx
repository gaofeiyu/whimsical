import { CSSProperties, ReactElement } from 'react';

type Props = {
  style: CSSProperties;
  children?: ReactElement | ReactElement[];
};

const Base = (props: Props) => {
  return <div style={props.style}>{props.children}</div>;
};

export default Base;
