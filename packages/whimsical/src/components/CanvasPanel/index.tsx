import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import CanvasEditLayer from '../CanvasEditLayer';
import CanvasRenderLayer from '../CanvasRenderLayer';
import CanvasToolbar from '../CanvasToolbar';
import { EDITOR_EVENTS$, EditorState } from '../../editor-flow';

export type CanvasPanelProps = {
  children?: React.ReactElement | React.ReactElement[];
};

const CanvasPanel = observer(() => {
  console.log('rerender CanvasPanel');
  useEffect(() => {
    const triggerButton = EDITOR_EVENTS$.on('triggerButton2', () => {
      console.log('CanvasPanel trigger editorObservable');
    });

    return () => {
      triggerButton();
    };
  }, []);
  return (
    <div className="flex flex-auto flex-col">
      <CanvasToolbar></CanvasToolbar>
      <div>EditorState: {JSON.stringify(EditorState.getStateOfRaw())}</div>
      <div className="flex-auto relative hidden">
        <CanvasEditLayer></CanvasEditLayer>
        <CanvasRenderLayer></CanvasRenderLayer>
      </div>
    </div>
  );
});

CanvasPanel.displayName = 'CanvasPanel';

export default CanvasPanel;
