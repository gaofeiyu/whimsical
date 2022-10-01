import { PushpinOutlined, PushpinFilled, CloseOutlined } from '@ant-design/icons';

export type PanelTitleProps = {
  title?: string;
  pushpin?: boolean;
  onChange?: (pushpinStatus: boolean) => void;
};

const PanelTitle = (props: PanelTitleProps) => {
  const { pushpin = false, onChange = () => null } = props;
  return (
    <div className="flex text-base px-2 py-1 whitespace-nowrap">
      <div>{props.title}</div>

      <div className="flex flex-1 justify-end items-center">
        {pushpin ? (
          <PushpinFilled onClick={() => onChange(false)} />
        ) : (
          <PushpinOutlined onClick={() => onChange(true)} />
        )}
        <CloseOutlined />
      </div>
    </div>
  );
};

PanelTitle.displayName = 'PanelTitle';

export default PanelTitle;
