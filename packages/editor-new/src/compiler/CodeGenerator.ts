import { JSONNode } from '../core/types';

export class CodeGenerator {
  generateCode(node: JSONNode): string {
    const templateCode = this.generateNodeCode(node, 2);

    return `<template>
${templateCode}
</template>

<script setup lang="ts">
import { ref } from 'vue';
</script>

<style scoped>
/* Scoped styles here */
</style>
`;
  }

  private generateNodeCode(node: JSONNode, indentLevel: number): string {
    const indent = ' '.repeat(indentLevel);
    const propsString = this.generatePropsString(node);

    // Tag name
    const tagName = node.type;

    // Self-closing tags if no children and no text
    if ((!node.children || node.children.length === 0) && !node.text) {
        return `${indent}<${tagName}${propsString}></${tagName}>`;
    }

    let innerContent = '';

    if (node.text) {
        innerContent = `\n${indent}  ${node.text}`;
    }

    let childrenCode = '';
    if (node.children && node.children.length > 0) {
        childrenCode = '\n' + node.children.map(child => this.generateNodeCode(child, indentLevel + 2)).join('\n');
    }

    return `${indent}<${tagName}${propsString}>${innerContent}${childrenCode}\n${indent}</${tagName}>`;
  }

  private generatePropsString(node: JSONNode): string {
    const propsList: string[] = [];

    // Always inject the tracking ID for bidirectional syncing
    propsList.push(`data-w-id="${node.id}"`);

    for (const [key, value] of Object.entries(node.props)) {
      if (value === undefined || value === null || value === '') continue;

      if (key === 'style' && typeof value === 'object') {
        // Convert style object to inline CSS string
        const styleEntries = Object.entries(value);
        if (styleEntries.length > 0) {
            const styleString = styleEntries.map(([k, v]) => {
                // simple camelCase to kebab-case
                const kebabKey = k.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
                return `${kebabKey}: ${v}`;
            }).join('; ');
            propsList.push(`style="${styleString}"`);
        }
      } else if (typeof value === 'string') {
        propsList.push(`${key}="${value}"`);
      } else if (typeof value === 'boolean') {
        if (value) propsList.push(`${key}`);
      } else {
        // Vue dynamic binding for numbers/objects
        propsList.push(`:${key}="${JSON.stringify(value).replace(/"/g, "'")}"`);
      }
    }

    return propsList.length > 0 ? ' ' + propsList.join(' ') : '';
  }
}
