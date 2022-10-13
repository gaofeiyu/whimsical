import { memo } from 'react';
import { useDrag } from 'react-dnd';
import { IComponentDeclare } from 'whimsical-shared';

interface Props {
  nodeFragment: IComponentDeclare;
  name: string;
}

const ComponentListItem: React.FC<Props> = (props) => {
  const { nodeFragment, name } = props;
  const [{ isDragging }, drag, dragPreview] = useDrag(() => {
    return {
      type: 'C_DECLARE',
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
  function styles(): React.CSSProperties {
    return isDragging ? { opacity: 0.5 } : {};
  }
  return (
    <div ref={dragPreview} className="w-36 mb-2" style={styles()}>
      <div className="py-1">{name}</div>
      <div ref={drag} className="border">
        <div className="flex items-center content-center h-6">
          <span>默认</span>
        </div>
      </div>
    </div>
  );
};

ComponentListItem.displayName = 'ComponentListItem';

export default memo(ComponentListItem);
