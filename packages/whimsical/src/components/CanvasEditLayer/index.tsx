import { ReactElement, useContext, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import WTreeNode from 'src/core/WNode';
import { WorkbenchContext } from 'src/pages/playground/context';
import { IWNode, ergodicNode, IErgodicNode } from 'whimsical-shared';
import { EDITOR_EVENTS$ } from 'src/editor-flow';
import Base from './selection-widgets/Base';
import { IRenderLayerTree } from '../CanvasRenderLayer/renderLayer';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import './index.css';

type Props = {
  children?: ReactElement;
};

const renderEditorElement = (treeNode: WTreeNode, renderLayerInfo: IRenderLayerTree) => {
  console.log('renderEditorElement');
  return ergodicNode<WTreeNode, ReactElement>({
    node: treeNode,
    callback: (props) => {
      const { currentNode, children } = props;
      if (!renderLayerInfo || !renderLayerInfo[currentNode.id]?.style) return;
      const style = renderLayerInfo[currentNode.id]?.style;
      let childrenNode: ReactElement[] = [];
      if (children && children.length) {
        childrenNode = children.map((item) => {
          return item.value;
        });
      }
      const ItemResult = (
        <Base id={currentNode.id} key={currentNode.id} node={currentNode} style={style}>
          {childrenNode}
        </Base>
      );
      return ItemResult;
    },
  });
};

const EditorLayer = observer((props: Props) => {
  const workbench = useContext(WorkbenchContext);
  if (!workbench.LibInfo) return null;
  const [WidgetResult, setWidgetResult] = useState(null);
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'NODE_FRAGMENT',
    drop: (item: { nodeFragment: IWNode }, monitor) => {
      console.log('monitor.didDrop', monitor.didDrop());
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  useEffect(() => {
    console.log('trigger rerender editor layer');
    if (workbench.treeNode) {
      const treeNode: IErgodicNode<ReactElement>[] = renderEditorElement(
        workbench.treeNode,
        toJS(workbench.renderLayerInfo)
      );
      setWidgetResult(treeNode[0].value);
    }

    const history = EDITOR_EVENTS$.on('history:goto', () => {
      if (workbench.treeNode) {
        const treeNode: IErgodicNode<ReactElement>[] = renderEditorElement(
          workbench.treeNode,
          toJS(workbench.renderLayerInfo)
        );
        console.log('trigger history ce', workbench.treeNode, treeNode[0].value);
        if (workbench.selection) {
          const selection = workbench.treeNode.findById(workbench.selection?.id);
          workbench.setSelection(selection);
        }
        setWidgetResult(treeNode[0].value);
      }
    });
    return () => {
      history();
    };
  }, [workbench.treeNode, workbench.renderLayerInfo]);

  return (
    <div ref={drop} className="editor-layer">
      {WidgetResult}
    </div>
  );
});

export default EditorLayer;
