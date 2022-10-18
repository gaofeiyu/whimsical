import { makeAutoObservable, observable } from 'mobx';
import { ComponentLibInfoResourceType, IComponentDeclare } from 'whimsical-shared';

export interface LibManagerProps {
  name: string;
  componentsDeclare?: Record<string, IComponentDeclare>;
  engine?: unknown;
}

class LibManager {
  name: string;
  resource?: ComponentLibInfoResourceType;
  componentsDeclare?: Record<string, IComponentDeclare>;
  engine?: unknown;

  constructor(props: LibManagerProps) {
    const { name, componentsDeclare, engine } = props;
    this.name = name;
    this.componentsDeclare = componentsDeclare;
    this.engine = engine;

    makeAutoObservable(this, {
      name: observable,
      componentsDeclare: observable,
      engine: observable,
    });
  }
}

export default LibManager;
