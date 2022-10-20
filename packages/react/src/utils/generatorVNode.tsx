import { ReactElement } from 'react';
import { IWNode, ergodicNode, getComponents } from 'whimsical-shared';

const components = getComponents();

export default function generatorDSL2JSX(node: IWNode) {
  const ergodicResult = ergodicNode<IWNode, ReactElement | null>({
    node,
    callback: (props) => {
      const { currentNode, nodeRenderId = '', children } = props;
      let result: ReactElement | null = null;

      if (!result) {
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
              {...currentNode.style}
              {...nodeProps}
            >
              {childrenNode}
            </Node>
          );
        }
      }

      return result;
    },
  });

  const result = ergodicResult.map((item) => {
    return item.value ? item.value : null;
  });

  return <>{result}</>;
}
