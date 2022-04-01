import React from "react";
import Editor from "@monaco-editor/react";

function getDefaultValue(triggers) {
  if (triggers.length === 0) {
    return `// event variable will (possibly) inject necessary content
function trigger(event) {
  console.log('Hello, World!');
}`;
  }

  return (
    "//use the name of the rule as the function name to be triggered\n" +
    triggers
      .map((funcName) => {
        return `function ${funcName}(event) {
  console.log('Hello, World!');
}`;
      })
      .join("\n\n")
  );
}

export default function TriggerEditor({ triggers }) {
  return (
    <Editor
      height="93vh"
      width="50%"
      defaultLanguage="javascript"
      defaultValue={getDefaultValue(triggers)}
      theme="vs-dark"
      options={{
        minimap: {
          enabled: true,
        },
      }}
    />
  );
}
