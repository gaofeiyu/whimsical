import React, { type DragEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { editorRoot, NodeTree } from './store/NodeTree';
import { globalHistory } from './store/HistoryManager';
import { componentRegistry } from './registry/ComponentRegistry';
import { PropertiesPanel } from './panels/PropertiesPanel';

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

    const registration = componentRegistry.get(componentType);
    const defaultProps = registration ? { ...registration.defaultProps } : {};

    const payload = {
      type: componentType,
      props: defaultProps
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

    const registration = componentRegistry.get(node.type);
    const isContainer = registration?.isContainer;

    const outlineColor = isSelected ? 'blue' : (isDropTarget && dropIndicator.position === 'inside' ? 'green' : 'transparent');
    const outlineStyle = (isSelected || (isDropTarget && dropIndicator.position === 'inside')) ? `2px solid ${outlineColor}` : '2px solid transparent';

    const topBorder = isDropTarget && dropIndicator.position === 'top' ? '4px solid green' : undefined;
    const bottomBorder = isDropTarget && dropIndicator.position === 'bottom' ? '4px solid green' : undefined;

    // Render inner component
    const ComponentToRender = registration?.component || 'div';
    const componentProps = { ...node.props };

    return (
      <div
        key={node.id}
        style={{
          position: 'relative',
          outline: outlineStyle,
          borderTop: topBorder,
          borderBottom: bottomBorder,
          minHeight: isContainer ? '40px' : undefined,
          transition: 'all 0.1s',
          cursor: 'pointer',
        }}
        onDragOver={(e) => handleDragOver(e, node.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, node.id)}
        onClick={(e) => handleNodeClick(e, node.id)}
      >
        {/* Overlay for non-containers to catch drag and click events instead of the component itself consuming them */}
        {!isContainer && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }} />
        )}

        {/* Floating actions for selected node */}
        {isSelected && node.id !== 'root' && (
          <div style={{ position: 'absolute', top: '-20px', right: 0, background: 'blue', color: 'white', padding: '2px 6px', fontSize: '10px', borderRadius: '4px', zIndex: 20 }}>
            {node.type}
            <button onClick={(e) => { e.stopPropagation(); handleDelete(node.id); }} style={{ marginLeft: '5px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
              ×
            </button>
          </div>
        )}

        {/* The actual component */}
        <ComponentToRender {...componentProps}>
          {isContainer ? (
            node.children.length > 0 ? (
               node.children.map(child => renderNode(child))
            ) : (
               <div style={{ padding: '20px', textAlign: 'center', color: '#ccc', fontSize: '12px' }}>Drag components here</div>
            )
          ) : undefined}
        </ComponentToRender>

      </div>
    );
  };


  const registeredComponents = componentRegistry.getAll().filter(c => c.type !== 'Page');

  return (
    <div className="editor-container" style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'sans-serif' }}>
      {/* Sidebar Component Library */}
      <section style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column' }}>
        <h3>组件库 (Components)</h3>
        {registeredComponents.map(comp => (
          <div
            key={comp.type}
            draggable
            onDragStart={(e) => handleDragStart(e, comp.type)}
            style={{ padding: '8px', border: '1px dashed #999', marginBottom: '8px', cursor: 'grab', backgroundColor: '#fff' }}
          >
            {comp.name}
          </div>
        ))}
      </section>

      {/* Main Canvas Area */}
      <section style={{ flex: 1, padding: '20px', backgroundColor: '#e0e0e0', overflowY: 'auto' }}>
        <h3 style={{ marginBottom: '10px' }}>画布 (Canvas)</h3>
        {renderNode(editorRoot)}
      </section>

      {/* Right Properties & History Panel */}
      <section style={{ width: '300px', borderLeft: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3>历史记录 (History)</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              disabled={!globalHistory.canUndo()}
              onClick={() => {
                const state = globalHistory.undo(JSON.stringify(editorRoot.serialize()));
                if (state) editorRoot.loadFromData(JSON.parse(state));
              }}
              style={{ cursor: globalHistory.canUndo() ? 'pointer' : 'not-allowed', color: globalHistory.canUndo() ? '#000' : '#ccc', padding: '5px 10px', border: '1px solid #ccc', background: '#fff' }}
            >
              撤销 (Undo)
            </button>
            <button
              disabled={!globalHistory.canRedo()}
              onClick={() => {
                const state = globalHistory.redo(JSON.stringify(editorRoot.serialize()));
                if (state) editorRoot.loadFromData(JSON.parse(state));
              }}
              style={{ cursor: globalHistory.canRedo() ? 'pointer' : 'not-allowed', color: globalHistory.canRedo() ? '#000' : '#ccc', padding: '5px 10px', border: '1px solid #ccc', background: '#fff' }}
            >
              重做 (Redo)
            </button>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '20px 0' }} />

        <div style={{ flex: 1 }}>
          <h3>属性配置 (Properties)</h3>
          <PropertiesPanel selectedNodeId={selectedNodeId} />
        </div>
      </section>
    </div>
  );
});

export default App;
