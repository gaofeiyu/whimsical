import { JSONNode } from '../core/types';

export class CodeParser {
  private baseState: JSONNode;

  constructor(baseState: JSONNode) {
    this.baseState = baseState;
  }

  private findNodeById(id: string, currentNode: JSONNode): JSONNode | null {
    if (currentNode.id === id) return currentNode;
    if (currentNode.children) {
      for (const child of currentNode.children) {
        const found = this.findNodeById(id, child);
        if (found) return found;
      }
    }
    return null;
  }

  parseCode(code: string): JSONNode | null {
    try {
      // Extract <template> content
      const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/);
      const templateString = templateMatch ? templateMatch[1] : code;

      // Use browser DOMParser to parse HTML string
      const parser = new DOMParser();
      const doc = parser.parseFromString(templateString, 'text/html');

      // The body contains the parsed template elements
      const rootElement = doc.body.firstElementChild;

      if (!rootElement) return null;

      return this.parseDOMElement(rootElement);

    } catch (error) {
      console.error('Failed to parse Vue code:', error);
      return null;
    }
  }

  private parseDOMElement(element: Element): JSONNode {
    // DOMParser upper cases the tag name. We convert back to kebab-case for Vue
    const type = element.tagName.toLowerCase();

    // Look for our tracking ID
    const trackingId = element.getAttribute('data-w-id');
    const id = trackingId || crypto.randomUUID();

    const props: Record<string, any> = {};

    // Map attributes
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      const name = attr.name;

      if (name === 'data-w-id') continue;

      if (name === 'style') {
        // Simple style string to object parser
        const styleObj: Record<string, string> = {};
        attr.value.split(';').forEach(rule => {
          if (!rule.trim()) return;
          const [key, value] = rule.split(':');
          if (key && value) {
            // kebab to camel case
            const camelKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            styleObj[camelKey] = value.trim();
          }
        });
        props.style = styleObj;
      } else if (name.startsWith(':')) {
         // Naive Vue dynamic binding evaluation (only for primitives like numbers/booleans for now)
         const bindName = name.slice(1);
         try {
             props[bindName] = JSON.parse(attr.value.replace(/'/g, '"'));
         } catch {
             props[bindName] = attr.value;
         }
      } else {
        props[name] = attr.value === '' ? true : attr.value;
      }
    }

    const children: JSONNode[] = [];
    let textContent = '';

    // Parse children and text nodes
    for (let i = 0; i < element.childNodes.length; i++) {
        const node = element.childNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE) {
            children.push(this.parseDOMElement(node as Element));
        } else if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim();
            if (text) {
                textContent += text;
            }
        }
    }

    const resultNode: JSONNode = {
        id,
        type,
        props
    };

    if (children.length > 0) {
        resultNode.children = children;
    }

    if (textContent) {
        resultNode.text = textContent;
    }

    // Preserve the original component type if it was modified but we still recognize the ID
    const existingNode = this.findNodeById(id, this.baseState);
    if (existingNode && existingNode.type !== type && existingNode.type.toLowerCase() === type) {
       resultNode.type = existingNode.type;
    }

    return resultNode;
  }
}
