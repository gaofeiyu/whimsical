import React, { type DragEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { editorRoot, NodeTree } from './store/NodeTree';
import { globalHistory } from './store/HistoryManager';

const App = observer(() => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ id: string, position: 'top' | 'bottom' | 'inside' } | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, componentType: string) => {
    e.dataTransfer.setData('componentType', componentType);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Calculate mouse position relative to target
    const targetRect = (e.target as HTMLElement).getBoundingClientRect();
    const hoverMiddleY = (targetRect.bottom - targetRect.top) / 2;
    const hoverClientY = e.clientY - targetRect.top;

    if (targetId === 'root') {
      setDropIndicator({ id: targetId, position: 'inside' });
      return;
    }

    if (hoverClientY < hoverMiddleY * 0.5) {
      setDropIndicator({ id: targetId, position: 'top' });
    } else if (hoverClientY > hoverMiddleY * 1.5) {
      setDropIndicator({ id: targetId, position: 'bottom' });
    } else {
      setDropIndicator({ id: targetId, position: 'inside' });
    }
  };

  const handleDragLeave = () => {
    setDropIndicator(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent bubbling up to parent containers

    const componentType = e.dataTransfer.getData('componentType');
    if (!componentType || !dropIndicator) {
      setDropIndicator(null);
      return;
    }

    const payload = {
      type: componentType,
      props: { style: { padding: '10px', margin: '5px', border: '1px solid #ccc', display: componentType === 'FlexBox' ? 'flex' : 'block' } }
    };

    if (dropIndicator.position === 'top') {
      editorRoot.executeCommand('insertBefore', targetId, payload);
    } else if (dropIndicator.position === 'bottom') {
      editorRoot.executeCommand('insertAfter', targetId, payload);
    } else {
      editorRoot.executeCommand('append', targetId, payload);
    }

    setDropIndicator(null);
  };

  const handleNodeClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedNodeId(id);
  };

  const handleDelete = (id: string) => {
    editorRoot.executeCommand('remove', id);
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    }
  };

  const renderNode = (node: NodeTree) => {
    const isSelected = selectedNodeId === node.id;
    const isDropTarget = dropIndicator?.id === node.id;

    let borderStyle = node.props.style?.border || '1px dashed #aaa';
    if (isSelected) borderStyle = '2px solid blue';
    if (isDropTarget && dropIndicator.position === 'inside') borderStyle = '2px solid green';

    const topBorder = isDropTarget && dropIndicator.position === 'top' ? '4px solid green' : undefined;
    const bottomBorder = isDropTarget && dropIndicator.position === 'bottom' ? '4px solid green' : undefined;

    return (
      <div
        key={node.id}
        style={{
          ...node.props.style,
          border: borderStyle,
          borderTop: topBorder || borderStyle.split(' ')[0] === '0px' ? undefined : topBorder,
          borderBottom: bottomBorder || borderStyle.split(' ')[0] === '0px' ? undefined : bottomBorder,
          minHeight: '40px',
          backgroundColor: node.type === 'Page' ? '#fff' : '#fafafa',
          transition: 'all 0.2s'
        }}
        onDragOver={(e) => handleDragOver(e, node.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, node.id)}
        onClick={(e) => handleNodeClick(e, node.id)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <strong>{node.type} {node.type === 'FlexBox' ? '(Container)' : ''}</strong>
          {node.id !== 'root' && (
            <button onClick={(e) => { e.stopPropagation(); handleDelete(node.id); }} style={{ fontSize: '10px' }}>
              Del
            </button>
          )}
        </div>
        {node.children.map(child => renderNode(child))}
      </div>
    );
  };

  const selectedNode = selectedNodeId ? editorRoot.findNodeById(selectedNodeId) : null;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'sans-serif' }}>
      {/* Sidebar Component Library */}
      <section style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column' }}>
        <h3>Components</h3>
        {['Button', 'Input', 'FlexBox', 'Text'].map(comp => (
          <div
            key={comp}
            draggable
            onDragStart={(e) => handleDragStart(e, comp)}
            style={{ padding: '8px', border: '1px dashed #999', marginBottom: '8px', cursor: 'grab', backgroundColor: '#fff' }}
          >
            {comp}
          </div>
        ))}
      </section>

      {/* Main Canvas Area */}
      <section style={{ flex: 1, padding: '20px', backgroundColor: '#e0e0e0', overflowY: 'auto' }}>
        <h3 style={{ marginBottom: '10px' }}>Canvas</h3>
        {renderNode(editorRoot)}
      </section>

      {/* Property Settings Panel */}
      <section style={{ width: '300px', borderLeft: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
          <h4>History</h4>
          <button
            disabled={!globalHistory.canUndo()}
            onClick={() => {
              const state = globalHistory.undo(JSON.stringify(editorRoot.serialize()));
              if (state) editorRoot.loadFromData(JSON.parse(state));
            }}>Undo</button>
          <button
            disabled={!globalHistory.canRedo()}
            onClick={() => {
              const state = globalHistory.redo(JSON.stringify(editorRoot.serialize()));
              if (state) editorRoot.loadFromData(JSON.parse(state));
            }}>Redo</button>
        </div>

        <h3>Settings</h3>
        {selectedNode ? (
          <div>
            <p><strong>ID:</strong> {selectedNode.id}</p>
            <p><strong>Type:</strong> {selectedNode.type}</p>
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => {
                editorRoot.executeCommand('updateProps', selectedNode.id, {
                  style: { ...selectedNode.props.style, backgroundColor: '#d4edda' }
                });
              }}>
                Set Green Background
              </button>
            </div>
            <div style={{ marginTop: '20px' }}>
              <h4>Schema Output:</h4>
              <pre style={{ fontSize: '10px', background: '#333', color: '#fff', padding: '10px', overflowX: 'auto' }}>
                {JSON.stringify(selectedNode.serialize(), null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <p>Select a node to view settings.</p>
        )}
      </section>
    </div>
  );
});

export default App;
