import React from 'react';
import { componentRegistry } from '../registry/ComponentRegistry';
import { JSONNode } from './types';

export const JsonRenderer: React.FC<{ node: JSONNode }> = ({ node }) => {
  const ComponentToRender = componentRegistry.get(node.type)?.component;

  if (!ComponentToRender) {
    console.warn(`Component of type ${node.type} not found in registry. Falling back to div.`);
    // Fallback if component is missing
    return <div {...node.props} data-w-id={node.id}>
      {node.children && node.children.map(child => <JsonRenderer key={child.id} node={child} />)}
    </div>;
  }

  return (
    <ComponentToRender {...node.props} data-w-id={node.id}>
      {node.children && node.children.map(child => <JsonRenderer key={child.id} node={child} />)}
    </ComponentToRender>
  );
};
