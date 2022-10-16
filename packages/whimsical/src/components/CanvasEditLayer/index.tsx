import { ReactElement, useContext, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import WTreeNode from '../../core/WNode';
import uuid from '../../utils/uuid';
import { EditorContext } from '../../pages/playground/EditorContext';
import { IWNode, ergodicNode, IErgodicNode } from 'whimsical-shared';
import { EDITOR_EVENTS$ } from '../../editor-flow';

type Props = {
  children?: ReactElement;
};

const renderEditorElement = (treeNode: WTreeNode) => {
  return ergodicNode<WTreeNode, ReactElement>({
    node: treeNode,
    callback: (props) => {
      const { currentNode, children } = props;
      let childrenNode: ReactElement[] = [];
      if (children && children.length) {
        childrenNode = children.map((item) => {
          return item.value;
        });
      }

      const ItemResult = (
        <div key={currentNode.id}>
          {currentNode.name}
          {childrenNode}
        </div>
      );
      return ItemResult;
    },
  });
};

const EditorLayer = (props: Props) => {
  const editorContext = useContext(EditorContext);
  const [WidgetResult, setWidgetResult] = useState(null);
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'NODE_FRAGMENT',
    drop: (item: { nodeFragment: IWNode }, monitor) => {
      if (!monitor.didDrop()) {
        const wTreeNode = editorContext.wTreeNode;
        wTreeNode.prepend(
          new WTreeNode({
            ...item.nodeFragment,
            id: uuid(),
          })
        );
        const treeNode: IErgodicNode<ReactElement>[] = renderEditorElement(wTreeNode);

        setWidgetResult(treeNode[0].value);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  useEffect(() => {
    if (editorContext.wTreeNode) {
      const treeNode: IErgodicNode<ReactElement>[] = renderEditorElement(editorContext.wTreeNode);
      setWidgetResult(treeNode[0].value);
    }

    const history = EDITOR_EVENTS$.on('history:goto', () => {
      if (editorContext.wTreeNode) {
        const treeNode: IErgodicNode<ReactElement>[] = renderEditorElement(editorContext.wTreeNode);
        setWidgetResult(treeNode[0].value);
      }
    });
    return () => {
      history();
    };
  }, [editorContext.wTreeNode]);

  return (
    <div ref={drop} className="w-full h-full border">
      请拖拽组件到区域中
      {WidgetResult}
      {props.children}
    </div>
  );
};

export default EditorLayer;
