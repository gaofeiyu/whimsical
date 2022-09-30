export type PanelTitleProps = {
  title?: string;
};

const PanelTitle = (props: PanelTitleProps) => {
  return <div className="text-base px-2 py-1 whitespace-nowrap">{props.title}</div>;
};

PanelTitle.displayName = 'PanelTitle';

export default PanelTitle;
