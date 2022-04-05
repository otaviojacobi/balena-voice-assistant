import Editor from '@monaco-editor/react';
import { useCallback } from 'react';

interface IntentsEditorProps {
  intents: string;
  setIntents: Function;
}

export default function IntentsEditor({
  intents,
  setIntents,
}: IntentsEditorProps) {
  const updateIntents = useCallback((e) => setIntents(e), [setIntents]);

  return (
    <Editor
      height='93vh'
      width='50%'
      defaultLanguage='yaml'
      defaultValue={intents}
      theme='vs-dark'
      options={{
        minimap: {
          enabled: true,
        },
      }}
      onChange={updateIntents}
    />
  );
}
