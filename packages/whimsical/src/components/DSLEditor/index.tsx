import React, { useState, useEffect, useCallback } from 'react';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { IWNode } from 'whimsical-shared';
import schema from './schema.json';

type Props = {
  value: string;
  // 是否显示操作栏
  displayAction?: boolean;
  onChange?: (value: IWNode) => void;
};

const DSLEditor = React.forwardRef((props: Props, ref) => {
  const { value, displayAction = false, onChange = () => null } = props;
  const editorRef = useMonaco();
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
    editorRef?.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: 'whim-json-schema.json',
          fileMatch: ['*'],
          schema: schema,
        },
      ],
    });
  }, [editorRef]);

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
