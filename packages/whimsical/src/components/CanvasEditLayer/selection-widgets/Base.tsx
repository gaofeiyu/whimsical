import { CSSProperties, ReactElement } from 'react';
import { IRenderLayerItemRect } from 'src/components/CanvasRenderLayer/renderLayer';

type Props = {
  id: string;
  style: IRenderLayerItemRect;
  children?: ReactElement | ReactElement[];
};

const Base = (props: Props) => {
  const { children, id, style } = props;
  return (
    <div id={id} style={style as CSSProperties}>
      {children}
    </div>
  );
};

export default Base;
