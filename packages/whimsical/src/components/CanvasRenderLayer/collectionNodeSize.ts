import { ergodicNode, IWNode } from 'whimsical-shared';
import { IRenderLayerItemRect, IRenderLayerTree } from './renderLayer';

const addListener = (editDom, renderDom) => {
  editDom &&
    editDom.addEventListener('scroll', () => {
      const top = editDom.scrollTop;
      const left = editDom.scrollLeft;
      renderDom.scrollTo(left, top);
    });
};

export const handleOverflow = (node, contentDocument): string => {
  const display = window.getComputedStyle(node, null).getPropertyValue('overflow');
  const editDom = document.querySelectorAll(`[data-designer-node-id='${node.id}']`)[0];

  setTimeout(() => {
    const renderDom = contentDocument.getElementById(`${node.id}-scroll-container`);
    addListener(editDom, renderDom);
  }, 20);

  if (display === 'scroll' || display === 'auto' || display === 'auto hidden') {
    const renderDom = node;
    addListener(editDom, renderDom);
  }
  return display;
};

export const collectionNodeSize = (node: IWNode, contentDocument: Document): IRenderLayerTree => {
  if (!contentDocument) return {};
  const rootDOMNode = contentDocument.querySelector('body');
  if (!rootDOMNode) return {};
  const rootDOMRect = rootDOMNode.getBoundingClientRect();
  const allSizeMap: IRenderLayerTree = {
    renderRoot: {
      style: {
        width: rootDOMRect.width,
        height: rootDOMRect.height,
      },
    },
    Root: {},
  };

  ergodicNode({
    node,
    callback: (props) => {
      const { currentNode, parentNode, nodeRenderId = '', parentRenderId = '' } = props;
      const currentDOMNode = contentDocument.getElementById(nodeRenderId);
      allSizeMap[currentNode.id] = allSizeMap[currentNode.id] || {
        children: {},
        style: {},
        hidden: false,
      };
      if (currentDOMNode) {
        const currentDOMRect = currentDOMNode.getBoundingClientRect();
        const overflow = handleOverflow(currentDOMNode, contentDocument);
        const currentNodeRect: IRenderLayerItemRect = {
          position: 'absolute',
          transform: `perspective(1px) translate3d(${rootDOMRect.x}px,${rootDOMRect.y}px,0)`,
          width: currentDOMRect.width,
          height: currentDOMRect.height,
          overflow: overflow,
        };
        if (parentNode) {
          const parentDOMNode: any = contentDocument.getElementById(parentRenderId) || rootDOMNode;
          const parentDOMRect = parentDOMNode.getBoundingClientRect();
          currentNodeRect.transform = `perspective(1px) translate3d(${
            currentDOMRect.x - parentDOMRect.x
          }px,${currentDOMRect.y - parentDOMRect.y}px,0)`;
        }

        const selectionBoxStyle = {
          ...currentNodeRect,
          transform: `perspective(1px) translate3d(${currentDOMRect.x - rootDOMRect.x}px,${
            currentDOMRect.y - rootDOMRect.y
          }px,0)`,
          toTop: currentDOMRect.top,
        };

        if (currentNode.id === nodeRenderId) {
          allSizeMap[nodeRenderId] = {
            style: currentNodeRect,
            selectionBoxStyle,
          };
        } else {
          allSizeMap[currentNode.id].children[nodeRenderId] = {
            style: currentNodeRect,
            selectionBoxStyle,
          };
        }
      } else {
        if (currentNode.id === nodeRenderId) {
          allSizeMap[nodeRenderId].hidden = true;
        } else {
          allSizeMap[currentNode.id].children[nodeRenderId] = {
            ...allSizeMap[currentNode.id].children[nodeRenderId],
            hidden: true,
          };
        }
      }
    },
  });

  return allSizeMap;
};
