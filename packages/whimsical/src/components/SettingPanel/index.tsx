import Panel from '../Panel';
import { SettingsForm } from 'src/widgets/SettingForm';

const SettingPanel = () => {
  return (
    <div className="flex">
      <Panel title="属性配置">
        <SettingsForm></SettingsForm>
      </Panel>
    </div>
  );
};

SettingPanel.displayName = 'SettingPanel';

export default SettingPanel;
