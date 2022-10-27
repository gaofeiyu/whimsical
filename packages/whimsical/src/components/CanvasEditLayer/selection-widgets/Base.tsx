import { CSSProperties, ReactElement, useMemo, useRef, useState } from 'react';
import { IWNode } from 'whimsical-shared';
import { useDrop, useDrag } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { IRenderLayerItemRect } from 'src/components/CanvasRenderLayer/renderLayer';

type DropPositionDirectionType = 'BEFORE' | 'INNER' | 'AFTER';

type DropItemType = { node: IWNode; path: string };

type Props = {
  id: string;
  style: IRenderLayerItemRect;
  children?: ReactElement | ReactElement[];
};

type CalcClassNameProps = {
  canDrop: boolean;
  isOver: boolean;
  upwards: DropPositionDirectionType;
  isFocus?: boolean;
};

const calcClassName = (props: CalcClassNameProps): string => {
  const { canDrop, isOver, upwards, isFocus } = props;
  const className: string[] = ['editor-item'];
  if (canDrop && isOver) {
    className.push('editor-item--hover');
    switch (upwards) {
      case 'BEFORE':
        className.push('editor-item--hover-before');
        break;
      case 'AFTER':
        className.push('editor-item--hover-after');
        break;
      case 'INNER':
        className.push('editor-item--hover-inner');
    }
  }
  if (isFocus) {
    className.push('editor-item--focus');
  }
  console.log('calcClassName', className.join(' '));
  return className.join(' ');
};

const Base = (props: Props) => {
  const { children, id, style } = props;
  const itemRef = useRef<HTMLDivElement>(null);
  const [upwards, setUpwards] = useState<DropPositionDirectionType>('AFTER');

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'NODE_FRAGMENT',
      // canDrop: () => true,
      hover: (item: DropItemType, monitor) => {
        console.log(item);
        if (!itemRef.current) return;
        if (monitor.isOver({ shallow: true })) {
          const hoverBoundingRect = itemRef.current?.getBoundingClientRect();
          const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 4;
          const clientOffset = monitor.getClientOffset();
          const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
          setUpwards(
            hoverClientY < hoverMiddleY
              ? 'BEFORE'
              : hoverClientY < 3 * hoverMiddleY
              ? 'INNER'
              : 'AFTER'
          );
        }
      },
      drop: (item, monitor) => {
        if (!monitor.didDrop()) {
          console.log('onAddNode', item);
        }
      },
      collect: (monitor) => {
        return {
          isOver: monitor.isOver({ shallow: true }),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [upwards]
  );
  drop(itemRef);

  const className = useMemo(() => {
    return calcClassName({
      canDrop,
      isOver,
      upwards,
    });
  }, [canDrop, isOver, upwards]);

  return (
    <div
      ref={itemRef}
      id={id}
      style={style as CSSProperties}
      className={`hover:outline-dashed hover:outline-purple-500 ${className}`}
    >
      {children}
    </div>
  );
};

export default Base;
