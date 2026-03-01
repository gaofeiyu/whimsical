import type { ComponentType } from 'react';

export type PropType = 'string' | 'number' | 'boolean' | 'color' | 'select' | 'object';

export interface PropDefinition {
  type: PropType;
  label: string;
  defaultValue?: any;
  options?: { label: string; value: any }[]; // For 'select' type
}

export interface ComponentRegistration {
  type: string;
  name: string;
  component: ComponentType<any>;
  icon?: string;
  propsSchema: Record<string, PropDefinition>;
  defaultProps: Record<string, any>;
  isContainer?: boolean;
}

class Registry {
  private components: Map<string, ComponentRegistration> = new Map();

  register(registration: ComponentRegistration) {
    this.components.set(registration.type, registration);
  }

  get(type: string): ComponentRegistration | undefined {
    return this.components.get(type);
  }

  getAll(): ComponentRegistration[] {
    return Array.from(this.components.values());
  }

  getComponent(type: string): ComponentType<any> | undefined {
    return this.components.get(type)?.component;
  }
}

export const componentRegistry = new Registry();
