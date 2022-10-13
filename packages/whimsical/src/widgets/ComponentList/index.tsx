import { memo, useContext } from 'react';
import { IComponentDeclare } from 'whimsical-shared';
import { EditorContext } from '../../pages/playground/EditorContext';
import ComponentListItem from './Item';

const ComponentList = () => {
  const { componentsDeclare } = useContext(EditorContext);
  const componentNameList = Object.keys(componentsDeclare || {});

  console.log(componentsDeclare);
  return (
    <div className="component-lib">
      <div className="dslList">
        {componentNameList.map((componentName, index) => {
          const componentDeclare: IComponentDeclare = componentsDeclare[componentName];
          return (
            <ComponentListItem
              name={`${componentDeclare.name} ${componentDeclare.cname}`}
              key={componentName}
              nodeFragment={componentDeclare}
            />
          );
        })}
      </div>
    </div>
  );
};

ComponentList.displayName = 'ComponentList';

export default memo(ComponentList);
