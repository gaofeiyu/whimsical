import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { type INode, NodeTree } from '../store/NodeTree';

export class CodeParser {
  private baseState: NodeTree;

  constructor(baseState: NodeTree) {
    this.baseState = baseState;
  }

  parseCode(code: string): INode | null {
    try {
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });

      let rootNode: INode | null = null;

      // Find the return statement of the default export function
      traverse(ast, {
        ReturnStatement: (path) => {
          if (path.node.argument && t.isJSXElement(path.node.argument)) {
            rootNode = this.parseJSXElement(path.node.argument);
            path.stop();
          }
        }
      });

      return rootNode;
    } catch (error) {
      console.error('Failed to parse code:', error);
      return null;
    }
  }

  private parseJSXElement(element: t.JSXElement): INode {
    const openingElement = element.openingElement;
    const elementName = t.isJSXIdentifier(openingElement.name) ? openingElement.name.name : 'div';

    const props: Record<string, any> = {};
    let id: string = crypto.randomUUID();

    for (const attr of openingElement.attributes) {
      if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
        const name = attr.name.name;

        if (name === 'data-w-id' && attr.value && t.isStringLiteral(attr.value)) {
          id = attr.value.value;
        } else if (attr.value) {
          if (t.isStringLiteral(attr.value)) {
            props[name] = attr.value.value;
          } else if (t.isJSXExpressionContainer(attr.value)) {
            const expr = attr.value.expression;
            if (t.isStringLiteral(expr) || t.isNumericLiteral(expr) || t.isBooleanLiteral(expr)) {
              props[name] = expr.value;
            } else if (t.isObjectExpression(expr)) {
              // Simple inline objects (e.g. style={{ padding: '24px' }})
               const obj: Record<string, any> = {};
               for (const prop of expr.properties) {
                 if (t.isObjectProperty(prop) && t.isIdentifier(prop.key) && (t.isStringLiteral(prop.value) || t.isNumericLiteral(prop.value))) {
                    obj[prop.key.name] = prop.value.value;
                 }
               }
               props[name] = obj;
            }
          }
        } else {
          // boolean shorthand (e.g., <button disabled />)
          props[name] = true;
        }
      }
    }

    // Determine semantic type based on tag
    let type = 'div';
    if (id === 'root') {
      type = 'Page';
    } else if (elementName === 'button') {
      type = 'Button';
    } else if (elementName === 'input') {
      type = 'Input';
    } else if (elementName === 'div' && props['display'] === 'flex') { // Heuristic
      type = 'FlexBox';
    } else if (elementName === 'div') {
      type = 'FlexBox'; // Default mapping since FlexBox renders to div in our system right now
    } else if (elementName === 'span') {
      type = 'Text';
    }

    // Check if this node exists in base tree to preserve original type if heuristic fails
    const existingNode = this.baseState.findNodeById(id);
    if (existingNode) {
       type = existingNode.type;
    }

    const children: INode[] = [];

    // Parse children
    for (const child of element.children) {
      if (t.isJSXElement(child)) {
        children.push(this.parseJSXElement(child));
      } else if (t.isJSXText(child)) {
        const text = child.value.trim();
        if (text) {
           if (type === 'Text') {
              props['content'] = text;
           } else {
             // Wrap raw text inside a generic container into a text node
             children.push({
               id: crypto.randomUUID(),
               type: 'Text',
               props: { content: text }
             });
           }
        }
      } else if (t.isJSXExpressionContainer(child) || t.isJSXFragment(child) || t.isJSXSpreadChild(child)) {
          // Fallback to custom code block
          children.push({
              id: crypto.randomUUID(),
              type: 'CustomCode',
              props: { code: generate(child).code }
          });
      }
    }

    // Attempt to flatten out style prop back onto main props if this matches our generator's behavior
    if (props['style'] && typeof props['style'] === 'object') {
       const styles = props['style'];
       for (const key in styles) {
           props[key] = styles[key];
       }
       delete props['style'];
    }

    // Clean up mapping artifact
    delete props['data-w-id'];

    return { id, type, props, children };
  }
}
