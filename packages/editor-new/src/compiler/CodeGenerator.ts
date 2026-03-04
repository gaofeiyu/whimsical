import { JSONNode } from '../core/types';

export class CodeGenerator {
  generateCode(node: JSONNode): string {
    const componentCode = this.generateNodeCode(node, 4);

    return `import React from 'react';

export default function GeneratedPage() {
  return (
${componentCode}
  );
}
`;
  }

  private generateNodeCode(node: JSONNode, indentLevel: number): string {
    const indent = ' '.repeat(indentLevel);
    const propsString = this.generatePropsString(node);

    // Special handling for Text component (it renders raw text content)
    if (node.type === 'Text') {
      const textProps = node.props as { content?: string };
      const textContent = textProps.content || '';
      return `${indent}<span${propsString}>\n${indent}  ${textContent}\n${indent}</span>`;
    }

    // Map internal types to HTML or specific React component tags
    const componentName = node.type === 'FlexBox' ? 'div' :
                          node.type === 'Page' ? 'div' :
                          node.type === 'Button' ? 'button' :
                          node.type === 'Input' ? 'input' : 'div';


    // Self-closing tags if no children
    if (!node.children || node.children.length === 0) {
      if (node.type !== 'Page') {
        return `${indent}<${componentName}${propsString} />`;
      } else {
        return `${indent}<${componentName}${propsString}></${componentName}>`;
      }
    }

    const childrenCode = node.children.map(child => this.generateNodeCode(child, indentLevel + 2)).join('\n');

    return `${indent}<${componentName}${propsString}>\n${childrenCode}\n${indent}</${componentName}>`;
  }

  private generatePropsString(node: JSONNode): string {
    const propsList: string[] = [];

    // Always inject the tracking ID for bidirectional syncing
    propsList.push(`data-w-id="${node.id}"`);

    for (const [key, value] of Object.entries(node.props)) {
      if (value === undefined || value === null || value === '') continue;

      if (node.type === 'Text' && key === 'content') continue; // Handled as inner children

      if (typeof value === 'string') {
        propsList.push(`${key}="${value}"`);
      } else if (typeof value === 'boolean') {
        if (value) propsList.push(`${key}`);
        else propsList.push(`${key}={false}`);
      } else {
        propsList.push(`${key}={${JSON.stringify(value)}}`);
      }
    }

    return propsList.length > 0 ? ' ' + propsList.join(' ') : '';
  }
}
