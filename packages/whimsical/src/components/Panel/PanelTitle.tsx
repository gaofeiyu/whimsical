import { CloseOutlined } from '@ant-design/icons';

export type PanelTitleProps = {
  title?: string;
  onClose?: () => void;
};

const PanelTitle = (props: PanelTitleProps) => {
  const { onClose = () => null } = props;
  return (
    <div className="flex text-base px-2 py-1 whitespace-nowrap">
      <div>{props.title}</div>

      <div className="flex flex-1 justify-end items-center">
        <CloseOutlined onClick={onClose} />
      </div>
    </div>
  );
};

PanelTitle.displayName = 'PanelTitle';

export default PanelTitle;
