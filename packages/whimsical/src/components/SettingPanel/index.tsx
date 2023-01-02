import Panel from '../Panel';
import { SettingsForm } from 'src/widgets/SettingForm';
import { useEWDrag } from 'src/hooks';

const SettingPanel = () => {
  const [contentRef, ewMouseDown] = useEWDrag<HTMLDivElement>({
    needSave: true,
    id: 'setting',
    direction: 'w',
  });
  return (
    <div ref={contentRef} className="relative flex w-[300px]">
      <Panel title="属性配置">
        <SettingsForm></SettingsForm>
      </Panel>
      <div
        onMouseDown={ewMouseDown}
        className="absolute top-0 left-0 w-1 h-full cursor-ew-resize"
      ></div>
    </div>
  );
};

SettingPanel.displayName = 'SettingPanel';

export default SettingPanel;
