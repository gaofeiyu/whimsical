import EventManager from 'src/laboratory/EventManager';
import StoreManager from 'src/laboratory/StoreManager';
import Panel from '../Panel';

const SettingPanel = () => {
  return (
    <div className="flex">
      <Panel title="属性配置属性配置属性配置">
        <EventManager />
        <StoreManager />
      </Panel>
    </div>
  );
};

SettingPanel.displayName = 'SettingPanel';

export default SettingPanel;
