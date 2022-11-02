import {
  CSSProperties,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IWNode } from 'whimsical-shared';
import { useDrag, useDrop } from 'react-dnd';
import { IRenderLayerItemRect } from '../../../components/CanvasRenderLayer/renderLayer';
import WTreeNode from '../../../core/WNode';
import uuid from '../../../utils/uuid';
import { useWorkbench } from 'src/hooks/useWorkbench';
import { observer } from 'mobx-react-lite';

type DropPositionDirectionType = 'BEFORE' | 'INNER' | 'AFTER';

type DropItemType = { nodeFragment: IWNode };

type Props = {
  id: string;
  style: IRenderLayerItemRect;
  node: WTreeNode;
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

const Base = observer((props: Props) => {
  const { children, id, style, node } = props;
  const itemRef = useRef<HTMLDivElement>(null);
  const [insertMode, setInsertMode] = useState<DropPositionDirectionType>('AFTER');
  const workbench = useWorkbench();

  // 自己被拖拽
  const [collected, drag, dragPreview] = useDrag(() => {
    return {
      type: 'NODE_FRAGMENT',
      item: {
        nodeFragment: node,
      },
      previewOptions: {
        offsetX: 0,
        offsetY: 0,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    };
  }, [node]);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'NODE_FRAGMENT',
      // canDrop: () => true,
      // 拖拽内容进过该组件区域
      hover: (item: DropItemType, monitor) => {
        if (!itemRef.current) return;
        if (item.nodeFragment.id === node.id) return;
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
          if (newInsertMode !== insertMode) {
            setInsertMode(newInsertMode);
          }
        }
      },
      drop: (item: DropItemType, monitor) => {
        if (item.nodeFragment.id === node.id) return;
        if (!monitor.didDrop()) {
          const newChild =
            item.nodeFragment instanceof WTreeNode
              ? item.nodeFragment
              : new WTreeNode({
                  ...item.nodeFragment,
                  id: uuid(),
                });
          node.prepend(newChild);
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

  const onSelectionChange = useCallback(
    (e) => {
      e.stopPropagation();
      workbench.setSelection(node);
    },
    [workbench]
  );

  const dropClassName = useMemo(() => {
    return calcClassName({
      canDrop,
      isOver,
      insertMode,
    });
  }, [canDrop, isOver, insertMode]);

  const className = useMemo(() => {
    const focusName = workbench.selection === node ? 'editor-item--focus' : '';
    return `${dropClassName} ${focusName}`;
  }, [workbench.selection, dropClassName]);

  useEffect(() => {
    drop(itemRef);
  }, []);

  // 绑定拖拽元素
  useEffect(() => {
    if (collected.isDragging) {
      dragPreview(itemRef);
    } else {
      drag(itemRef);
    }
    node.isInOperation = collected.isDragging;
  }, [collected.isDragging]);

  return (
    <div
      ref={itemRef}
      id={id}
      data-component-name={node.name}
      style={style as CSSProperties}
      className={className}
      onMouseDown={onSelectionChange}
    >
      {children}
    </div>
  );
});

export default Base;
