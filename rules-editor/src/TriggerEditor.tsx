import Editor from '@monaco-editor/react';
import { useCallback } from 'react';
import { defaultIntents } from './defaultValues';

export default function TriggerEditor({
  setIntents,
}: {
  setIntents: Function;
}) {
  const updateIntents = useCallback((e) => setIntents(e), [setIntents]);

  return (
    <Editor
      height='93vh'
      width='50%'
      defaultLanguage='yaml'
      defaultValue={defaultIntents()}
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
