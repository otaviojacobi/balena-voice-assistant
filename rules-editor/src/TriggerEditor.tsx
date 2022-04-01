import Editor from '@monaco-editor/react';

export default function TriggerEditor() {
  return (
    <Editor
      height='93vh'
      width='50%'
      defaultLanguage='yaml'
      defaultValue='// will be home assitant yaml'
      theme='vs-dark'
      options={{
        minimap: {
          enabled: true,
        },
      }}
    />
  );
}
