import React, { useMemo } from 'react';
import { IRuntimeContext, IWNode } from 'whimsical-shared';
import generateNodeTree from './generateNodeTree';

export const RuntimeContext = React.createContext<IRuntimeContext>({});

export const WNodeRenderComponent = (context: IRuntimeContext) => {
  const { node } = context;
  if (!node) return <></>;
  return <>{node?.name ? generateNodeTree(node) : <></>}</>;
};

export interface IWViewProps {
  node: IWNode;
}

export const WView = (props: IWViewProps) => {
  const { node } = props;

  const context: IRuntimeContext = useMemo(() => {
    return {
      node,
    };
  }, [node]);
  return (
    <RuntimeContext.Provider
      value={{
        node,
      }}
    >
      {WNodeRenderComponent(context)}
    </RuntimeContext.Provider>
  );
};
