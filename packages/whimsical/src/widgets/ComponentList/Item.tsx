import { memo, useEffect, useMemo, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { IComponentDeclare } from 'whimsical-shared';

interface Props {
  nodeFragment: IComponentDeclare;
  name: string;
}

const ComponentListItem: React.FC<Props> = (props) => {
  const { nodeFragment, name } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, dragPreview] = useDrag(() => {
    return {
      type: 'NODE_FRAGMENT',
      item: {
        nodeFragment,
      },
      previewOptions: {
        offsetX: 0,
        offsetY: 0,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    };
  });

  const previewClassName = useMemo(() => {
    return isDragging ? 'opacity-50' : {};
  }, [isDragging]);

  // 绑定拖拽元素
  useEffect(() => {
    if (isDragging) {
      dragPreview(ref);
    } else {
      drag(ref);
    }
  }, [isDragging]);

  return (
    <div ref={ref} className={`w-36 mb-2 ${previewClassName}`}>
      <div className="border">
        <div className="flex items-center content-center h-6 cursor-pointer">{name}</div>
      </div>
    </div>
  );
};

ComponentListItem.displayName = 'ComponentListItem';

export default memo(ComponentListItem);
