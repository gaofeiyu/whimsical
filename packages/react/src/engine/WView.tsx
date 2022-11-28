import React, { useMemo } from 'react';
import { IRuntimeContext, IWBody } from 'whimsical-shared';
import generateNodeTree from './generateNodeTree';

export const RuntimeContext = React.createContext<IRuntimeContext>({});

export const WNodeRenderComponent = (context: IRuntimeContext, wBody: IWBody) => {
  const { node, state = {} } = wBody;
  if (!node) return <></>;
  return <>{node?.name ? generateNodeTree(context, node, state) : <></>}</>;
};

export interface IWViewProps {
  wBody: IWBody;
}

export const WView = (props: IWViewProps) => {
  const { wBody } = props;
  const { node } = wBody;

  const context: IRuntimeContext = useMemo(() => {
    return {
      wBody,
    };
  }, [node]);
  return (
    <RuntimeContext.Provider
      value={{
        wBody,
      }}
    >
      {WNodeRenderComponent(context, wBody)}
    </RuntimeContext.Provider>
  );
};
