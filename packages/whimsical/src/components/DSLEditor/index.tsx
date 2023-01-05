import React, { useState, useEffect, useCallback } from 'react';
import MonacoEditor, { useMonaco, loader } from '@monaco-editor/react';
import { IWNode } from 'whimsical-shared';
import schema from './schema.json';

loader.config({
  paths: {
    vs: '/lib/monaco-editor/vs',
  },
});

type Props = {
  value: string;
  // 是否显示操作栏
  displayAction?: boolean;
  onChange?: (value: IWNode) => void;
};

const DSLEditor = React.forwardRef((props: Props, ref) => {
  const { value, displayAction = false, onChange = () => null } = props;
  const monacoEditor = useMonaco();
  const [state, setState] = useState<string>('');

  const handleChange = useCallback(
    (newValue) => {
      setState(newValue);
      if (!displayAction) {
        onChange(newValue);
      }
    },
    [displayAction, onChange]
  );

  useEffect(() => {
    monacoEditor?.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: 'whim-json-schema',
          fileMatch: ['*'],
          schema: schema,
        },
      ],
    });
  }, [monacoEditor]);

  useEffect(() => {
    setState(value);
  }, [value]);

  return (
    <div className="w-full h-full">
      <MonacoEditor
        defaultValue="{}"
        language="json"
        value={state}
        options={{
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
          tabSize: 2,
        }}
        onChange={handleChange}
      />
    </div>
  );
});

DSLEditor.displayName = 'DSLEditor';

export default DSLEditor;
