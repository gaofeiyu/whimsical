import { memo, useContext, useMemo } from 'react';
import { IComponentDeclare, IWNode } from 'whimsical-shared';
import { EditorContext } from '../../pages/playground/EditorContext';
import ComponentListItem from './Item';

type convertDeclareToNodeProps = { declare: IComponentDeclare; id?: string };

const convertDeclareToNode = (props: convertDeclareToNodeProps): IWNode => {
  const { declare, id = 'NEW_NODE' } = props;
  return {
    name: declare.name,
    type: declare.type,
    id,
  };
};

const ComponentList = () => {
  const { componentsDeclare } = useContext(EditorContext);
  const componentNameList = Object.keys(componentsDeclare || {});

  const nodeTemplates: IWNode[] = useMemo(() => {
    return componentNameList.map((componentName) => {
      const declare: IComponentDeclare = componentsDeclare[componentName];
      const template = convertDeclareToNode({
        declare,
      });
      return template;
    });
  }, [componentsDeclare]);

  return (
    <div className="flex flex-col items-center">
      {componentNameList.map((componentName, index) => {
        const componentDeclare: IComponentDeclare = componentsDeclare[componentName];
        return (
          <ComponentListItem
            name={`${componentDeclare.name} ${componentDeclare.cname}`}
            key={componentName}
            nodeFragment={nodeTemplates[index]}
          />
        );
      })}
    </div>
  );
};

ComponentList.displayName = 'ComponentList';

export default memo(ComponentList);