import { observer } from 'mobx-react-lite';
import {  editorRoot } from '../store/NodeTree';
import { componentRegistry } from '../registry/ComponentRegistry';

interface PropertiesPanelProps {
  selectedNodeId: string | null;
}

export const PropertiesPanel = observer(({ selectedNodeId }: PropertiesPanelProps) => {
  if (!selectedNodeId) {
    return <div style={{ padding: '10px', color: '#666' }}>请选择一个节点以查看属性。</div>;
  }

  const node = editorRoot.findNodeById(selectedNodeId);
  if (!node) {
    return <div style={{ padding: '10px', color: '#666' }}>未找到节点。</div>;
  }

  const registration = componentRegistry.get(node.type);
  if (!registration) {
    return <div style={{ padding: '10px', color: '#666' }}>未找到该组件的配置信息: {node.type}</div>;
  }

  const schema = registration.propsSchema;

  const handlePropChange = (propName: string, value: any) => {
    editorRoot.executeCommand('updateProps', node.id, { [propName]: value });
  };

  return (
    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <strong>类型:</strong> {registration.name}
        <br />
        <span style={{ fontSize: '12px', color: '#888' }}>ID: {node.id}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {Object.entries(schema).map(([propName, def]) => {
          const value = node.props[propName] !== undefined ? node.props[propName] : def.defaultValue;

          let inputControl = null;

          if (def.type === 'string' || def.type === 'number') {
            inputControl = (
              <input
                type={def.type === 'number' ? 'number' : 'text'}
                value={value || ''}
                onChange={(e) => handlePropChange(propName, e.target.value)}
                style={{ width: '100%', padding: '4px', boxSizing: 'border-box' }}
              />
            );
          } else if (def.type === 'color') {
            inputControl = (
              <div style={{ display: 'flex', gap: '5px' }}>
                <input
                  type="color"
                  value={value || '#000000'}
                  onChange={(e) => handlePropChange(propName, e.target.value)}
                />
                <input
                  type="text"
                  value={value || ''}
                  onChange={(e) => handlePropChange(propName, e.target.value)}
                  style={{ flex: 1, padding: '4px' }}
                />
              </div>
            );
          } else if (def.type === 'select' && def.options) {
            inputControl = (
              <select
                value={value || ''}
                onChange={(e) => handlePropChange(propName, e.target.value)}
                style={{ width: '100%', padding: '4px' }}
              >
                {def.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            );
          } else if (def.type === 'boolean') {
            inputControl = (
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => handlePropChange(propName, e.target.checked)}
              />
            );
          }

          return (
            <div key={propName} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>{def.label} ({propName})</label>
              {inputControl}
            </div>
          );
        })}
      </div>
    </div>
  );
});
