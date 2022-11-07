import Panel from '../Panel';
import SettingForm from 'src/widgets/SettingForm';

const SettingPanel = () => {
  return (
    <div className="flex">
      <Panel title="属性配置">
        <SettingForm></SettingForm>
      </Panel>
    </div>
  );
};

SettingPanel.displayName = 'SettingPanel';

export default SettingPanel;
