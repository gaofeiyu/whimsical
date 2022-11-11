import { ReactElement } from 'react';
import { IWNode, ergodicNode, getComponents } from 'whimsical-shared';

const components = getComponents();

export default function generateNodeTree(node: IWNode) {
  const ergodicResult = ergodicNode<IWNode, ReactElement | null>({
    node,
    callback: (props) => {
      const { currentNode, nodeRenderId = '', children } = props;
      let result: ReactElement | null = null;

      const Node: any = components[currentNode.name];
      if (Node) {
        const childrenNode: ReactElement[] = [];
        if (children && children.length) {
          children.forEach((child) => {
            if (child.value) {
              childrenNode.push(child.value);
            }
          });
        }
        //props
        const nodeProps = currentNode.props;

        result = (
          <Node
            key={nodeRenderId}
            id={nodeRenderId}
            className={'coralsea_' + nodeRenderId}
            style={currentNode.style}
            {...nodeProps}
          >
            {childrenNode.length ? childrenNode : null}
          </Node>
        );
      }
      return result;
    },
  });

  const result = ergodicResult.map((item) => {
    return item.value ? item.value : null;
  });

  return <>{result}</>;
}
