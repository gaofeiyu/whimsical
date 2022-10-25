import { CSSProperties, ReactElement } from 'react';
import { IRenderLayerItemRect } from 'src/components/CanvasRenderLayer/renderLayer';

type Props = {
  style: IRenderLayerItemRect;
  children?: ReactElement | ReactElement[];
};

const Base = (props: Props) => {
  return <div style={props.style as CSSProperties}>{props.children}</div>;
};

export default Base;
