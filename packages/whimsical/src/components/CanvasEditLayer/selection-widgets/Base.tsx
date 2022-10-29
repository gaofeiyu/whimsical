import { CSSProperties, ReactElement, useMemo, useRef, useState } from 'react';
import { IWNode } from 'whimsical-shared';
import { useDrop } from 'react-dnd';
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
  insertMode: DropPositionDirectionType;
  isFocus?: boolean;
};

const calcClassName = (props: CalcClassNameProps): string => {
  const { canDrop, isOver, insertMode, isFocus } = props;
  const className: string[] = ['editor-item'];
  if (canDrop && isOver) {
    className.push('editor-item--hover');
    switch (insertMode) {
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
  return className.join(' ');
};

const HOT_AREA_RATIO = 0.25;

const getHotArea = (height) => {
  return [Math.round(height * HOT_AREA_RATIO), Math.round(height * (1 - HOT_AREA_RATIO))];
};

const Base = (props: Props) => {
  const { children, id, style } = props;
  const itemRef = useRef<HTMLDivElement>(null);
  const [insertMode, setInsertMode] = useState<DropPositionDirectionType>('AFTER');

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'NODE_FRAGMENT',
      // canDrop: () => true,
      // 拖拽内容进过该组件区域
      hover: (item: DropItemType, monitor) => {
        if (!itemRef.current) return;
        if (monitor.isOver({ shallow: true })) {
          const hoverBoundingRect = itemRef.current?.getBoundingClientRect();
          // 确定当前模块元素1/4的高度用来做热区计算
          const [hotAreaTop, hotAreaBottom] = getHotArea(
            hoverBoundingRect.bottom - hoverBoundingRect.top
          );
          const clientOffset = monitor.getClientOffset();
          const hoverClientY = clientOffset.y - hoverBoundingRect.top;
          const newInsertMode =
            hoverClientY < hotAreaTop ? 'BEFORE' : hoverClientY < hotAreaBottom ? 'INNER' : 'AFTER';
          console.log(newInsertMode, insertMode, hoverClientY, hotAreaTop, hotAreaBottom);
          if (newInsertMode !== insertMode) {
            setInsertMode(newInsertMode);
          }
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
    [insertMode]
  );
  drop(itemRef);

  const className = useMemo(() => {
    return calcClassName({
      canDrop,
      isOver,
      insertMode,
    });
  }, [canDrop, isOver, insertMode]);

  return (
    <div ref={itemRef} id={id} style={style as CSSProperties} className={className}>
      {children}
    </div>
  );
};

export default Base;
