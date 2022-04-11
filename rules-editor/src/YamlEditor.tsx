import Editor from '@monaco-editor/react';
import { useCallback } from 'react';

interface YamlEditorProps {
  config: string;
  setConfig: Function;
}

export default function YamlEditor({ config, setConfig }: YamlEditorProps) {
  const updateConfigs = useCallback((e) => setConfig(e), [setConfig]);

  return (
    <Editor
      height='93vh'
      width='50%'
      defaultLanguage='yaml'
      defaultValue={config}
      theme='vs-dark'
      options={{
        minimap: {
          enabled: true,
        },
      }}
      onChange={updateConfigs}
    />
  );
}
