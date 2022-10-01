import React, { useMemo, useState } from 'react';
import PanelTitle from './PanelTitle';

export type PanelProps = {
  title?: string;
  className?: string;
  children?: string | React.ReactElement | React.ReactElement[];
};

const Panel = (props: PanelProps) => {
  const { title, className = '' } = props;
  const [pushpin, setPushpin] = useState(false);

  const pushpinClassName = useMemo(() => {
    return pushpin ? 'absolute' : '';
  }, [pushpin]);

  return (
    <div
      className={`${pushpinClassName} flex flex-col justify-start w-full h-full border m-[-1px] ${className}`}
    >
      <PanelTitle
        title={title}
        onChange={(pushpinStatus) => {
          setPushpin(pushpinStatus);
        }}
      />
      <div>{props.children}</div>
    </div>
  );
};

Panel.displayName = 'Panel';

export default Panel;
