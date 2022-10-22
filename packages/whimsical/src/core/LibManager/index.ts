import { makeObservable, observable } from 'mobx';
import { ComponentLibInfoResourceType, IComponentDeclare } from 'whimsical-shared';

export interface IEngine {
  render: () => unknown;
}
export interface LibManagerProps {
  name: string;
  componentsDeclare?: Record<string, IComponentDeclare>;
  engine?: IEngine;
  resource?: ComponentLibInfoResourceType;
}

class LibManager {
  name: string;
  resource?: ComponentLibInfoResourceType;
  componentsDeclare?: Record<string, IComponentDeclare>;
  engine?: IEngine;

  constructor(props: LibManagerProps) {
    const { name, componentsDeclare, engine, resource } = props;
    this.name = name;
    this.componentsDeclare = componentsDeclare;
    this.engine = engine;
    this.resource = resource;

    makeObservable<LibManager, string>(this, {
      name: observable,
      componentsDeclare: observable,
      engine: observable,
    });
  }
}

export default LibManager;
