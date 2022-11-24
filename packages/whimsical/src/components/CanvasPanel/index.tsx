import React, { useCallback, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import CanvasEditLayer from '../CanvasEditLayer';
import CanvasRenderLayer from '../CanvasRenderLayer';
import CanvasToolbar from '../CanvasToolbar';
import { EDITOR_EVENTS$ } from 'src/editor-flow';

export type CanvasPanelProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const CanvasPanel = observer(() => {
  const resizeRaf = useRef(null);
  const onResize = useCallback((e: Event) => {
    if (e.preventDefault) e.preventDefault();
    resizeRaf.current = requestAnimationFrame(() => {
      cancelAnimationFrame(resizeRaf.current);
      EDITOR_EVENTS$.emit('canvas:resize');
    });
  }, []);
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  return (
    <div className="flex flex-auto flex-col">
      <CanvasToolbar></CanvasToolbar>
      <div className="flex-auto relative">
        <CanvasRenderLayer></CanvasRenderLayer>
        <CanvasEditLayer></CanvasEditLayer>
      </div>
    </div>
  );
});

CanvasPanel.displayName = 'CanvasPanel';

export default CanvasPanel;
