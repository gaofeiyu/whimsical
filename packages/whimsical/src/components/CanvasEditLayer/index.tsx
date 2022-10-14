import { ReactElement } from 'react';
import { useDrop } from 'react-dnd';

type Props = {
  children?: ReactElement;
};

const EditorLayer = (props: Props) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'NODE_FRAGMENT',
    drop: (item, monitor) => {
      console.log('drop item', item);
      if (!monitor.didDrop()) {
        console.log('drop item', item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div ref={drop} className="w-full h-full border">
      请拖拽组件到区域中
      {props.children}
    </div>
  );
};

export default EditorLayer;
