import { CSSProperties, ReactElement } from 'react';
import {
  IWNode,
  ergodicNode,
  getComponents,
  execProp,
  BodyStateType,
  IRuntimeContext,
  generatorEvents,
} from 'whimsical-shared';

const components = getComponents();

function filterStyles(styles: React.CSSProperties, state: BodyStateType): React.CSSProperties {
  const style: React.CSSProperties = {};
  Object.keys(styles)
    .filter((key) => styles[key])
    .forEach((key) => {
      style[key] = execProp(styles[key], {
        state,
      });
    });
  return style;
}

function convertProps(props, state) {
  const keys = Object.keys(props);
  // 无法确定属性的具体类型
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newProps: any = {};

  keys.forEach((key) => {
    newProps[key] = execProp(props[key], {
      state,
    });
  });

  return newProps;
}

export default function generateNodeTree(
  context: IRuntimeContext<any>,
  node: IWNode,
  state: BodyStateType
) {
  const ergodicResult = ergodicNode<IWNode, ReactElement | null>({
    node,
    callback: (props) => {
      const { currentNode, nodeRenderId = '', children } = props;
      let result: ReactElement | null = null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Node: React.FC<any> = components[currentNode.name] as React.FC<any>;
      if (Node) {
        const childrenNode: ReactElement[] = [];
        if (children && children.length) {
          children.forEach((child) => {
            if (child.value) {
              childrenNode.push(child.value);
            }
          });
        }

        // style
        const nodeStyle: CSSProperties = filterStyles(currentNode.style || {}, state);

        //props
        const newProps = convertProps(currentNode.props || {}, state);

        //event
        const nodeEvent: any = generatorEvents(currentNode.events || [], {
          state,
          context,
        });

        result = (
          <Node
            key={nodeRenderId}
            id={nodeRenderId}
            className={'coralsea_' + nodeRenderId}
            style={nodeStyle}
            {...newProps}
            {...nodeEvent}
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
