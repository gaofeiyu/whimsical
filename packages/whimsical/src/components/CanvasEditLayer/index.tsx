import { ReactElement, useContext, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import WTreeNode from '../../core/WNode';
import uuid from '../../utils/uuid';
import { WorkbenchContext } from '../../pages/playground/context';
import { IWNode, ergodicNode, IErgodicNode } from 'whimsical-shared';
import { EDITOR_EVENTS$ } from '../../editor-flow';
import Base from './selection-widgets/Base';
import { IRenderLayerTree } from '../CanvasRenderLayer/renderLayer';
import { observer } from 'mobx-react-lite';

type Props = {
  children?: ReactElement;
};

const renderEditorElement = (treeNode: WTreeNode, renderLayerInfo: IRenderLayerTree) => {
  console.log('renderEditorElement');
  return ergodicNode<WTreeNode, ReactElement>({
    node: treeNode,
    callback: (props) => {
      const { currentNode, children } = props;
      const style = renderLayerInfo ? renderLayerInfo[currentNode.id]?.style : {};
      let childrenNode: ReactElement[] = [];
      if (children && children.length) {
        childrenNode = children.map((item) => {
          return item.value;
        });
      }

      const ItemResult = (
        <Base key={currentNode.id} style={style}>
          {childrenNode}
        </Base>
      );
      return ItemResult;
    },
  });
};

const EditorLayer = observer((props: Props) => {
  const workbench = useContext(WorkbenchContext);
  const [WidgetResult, setWidgetResult] = useState(null);
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'NODE_FRAGMENT',
    drop: (item: { nodeFragment: IWNode }, monitor) => {
      if (!monitor.didDrop()) {
        const wTreeNode = workbench.treeNode;
        wTreeNode.prepend(
          new WTreeNode({
            ...item.nodeFragment,
            id: uuid(),
          })
        );
        const treeNode: IErgodicNode<ReactElement>[] = renderEditorElement(
          wTreeNode,
          workbench.renderLayerInfo
        );

        setWidgetResult(treeNode[0].value);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  useEffect(() => {
    if (workbench.treeNode) {
      const treeNode: IErgodicNode<ReactElement>[] = renderEditorElement(
        workbench.treeNode,
        workbench.renderLayerInfo
      );
      setWidgetResult(treeNode[0].value);
    }

    const history = EDITOR_EVENTS$.on('history:goto', () => {
      if (workbench.treeNode) {
        const treeNode: IErgodicNode<ReactElement>[] = renderEditorElement(
          workbench.treeNode,
          workbench.renderLayerInfo
        );
        setWidgetResult(treeNode[0].value);
      }
    });
    return () => {
      history();
    };
  }, [workbench.treeNode, workbench.renderLayerInfo]);
  console.log(123);
  return (
    <div ref={drop} className="absolute top-0 left-0 w-full h-full">
      {WidgetResult}
    </div>
  );
});

export default EditorLayer;
