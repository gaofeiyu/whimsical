import {
  CSSProperties,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IComponentDeclare, IWNode } from 'whimsical-shared';
import { useDrag, useDrop } from 'react-dnd';
import { IRenderLayerItemRect } from 'src/components/CanvasRenderLayer/renderLayer';
import WTreeNode from 'src/core/WNode';
import uuid from 'src/utils/uuid';
import { useWorkbench } from 'src/hooks/useWorkbench';
import { observer } from 'mobx-react-lite';
import { useComponentDeclare } from 'src/hooks';

enum DROP_POSITION_DIRECTION {
  BEFORE = 'BEFORE',
  INNER = 'INNER',
  AFTER = 'AFTER',
}

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
  insertMode: DROP_POSITION_DIRECTION;
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

const CONTAINER_HOT_AREA_RATIO = 0.25;
const HOT_AREA_RATIO = 0.5;

const getHotArea = (height, ratio) => {
  return [Math.round(height * ratio), Math.round(height * (1 - ratio))];
};

const Base = observer((props: Props) => {
  const { children, id, style, node } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [insertMode, setInsertMode] = useState<DROP_POSITION_DIRECTION>(
    DROP_POSITION_DIRECTION.AFTER
  );
  const workbench = useWorkbench();
  const componentDeclare: IComponentDeclare = useComponentDeclare(node.name);
  const hotAreaRatio =
    componentDeclare.isContainer === false ? HOT_AREA_RATIO : CONTAINER_HOT_AREA_RATIO;

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
        if (!ref.current) return;
        if (item.nodeFragment.id === node.id) return;
        if (monitor.isOver({ shallow: true })) {
          const hoverBoundingRect = ref.current?.getBoundingClientRect();
          // 确定当前模块元素1/4的高度用来做热区计算
          const [hotAreaTop, hotAreaBottom] = getHotArea(
            hoverBoundingRect.bottom - hoverBoundingRect.top,
            hotAreaRatio
          );
          const clientOffset = monitor.getClientOffset();
          const hoverClientY = clientOffset.y - hoverBoundingRect.top;
          const newInsertMode =
            hoverClientY < hotAreaTop
              ? DROP_POSITION_DIRECTION.BEFORE
              : hoverClientY < hotAreaBottom
              ? DROP_POSITION_DIRECTION.INNER
              : DROP_POSITION_DIRECTION.AFTER;
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
          console.log('drop', node.name, 'new noode id', newChild.id, insertMode);
          switch (insertMode) {
            case DROP_POSITION_DIRECTION.BEFORE:
              node.insertBefore(newChild);
              break;

            case DROP_POSITION_DIRECTION.AFTER:
              node.insertAfter(newChild);
              break;

            case DROP_POSITION_DIRECTION.INNER:
              node.append(newChild);
              break;

            default:
            // no default
          }
          workbench.setSelection(newChild);
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
    drop(ref);
  }, []);

  // 绑定拖拽元素
  useEffect(() => {
    if (collected.isDragging) {
      dragPreview(ref);
    } else {
      drag(ref);
    }
    node.isInOperation = collected.isDragging;
  }, [collected.isDragging]);

  return (
    <div
      ref={ref}
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
