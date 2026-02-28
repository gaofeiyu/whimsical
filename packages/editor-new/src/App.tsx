import React, { type DragEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { editorRoot, NodeTree } from './store/NodeTree';

const App = observer(() => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, componentType: string) => {
    e.dataTransfer.setData('componentType', componentType);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent bubbling up to parent containers
    const componentType = e.dataTransfer.getData('componentType');
    if (componentType) {
      editorRoot.executeCommand('append', targetId, {
        type: componentType,
        props: { style: { padding: '10px', margin: '5px', border: '1px solid #ccc' } }
      });
    }
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
    return (
      <div
        key={node.id}
        style={{
          ...node.props.style,
          border: isSelected ? '2px solid blue' : node.props.style?.border || '1px dashed #aaa',
          minHeight: '40px',
          backgroundColor: node.type === 'Page' ? '#fff' : '#fafafa'
        }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, node.id)}
        onClick={(e) => handleNodeClick(e, node.id)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <strong>{node.type}</strong>
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
      <section style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9' }}>
        <h3>Components</h3>
        {['Button', 'Input', 'Container', 'Text'].map(comp => (
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
      <section style={{ width: '300px', borderLeft: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9' }}>
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
