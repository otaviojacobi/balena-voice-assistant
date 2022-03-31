import React, { useCallback, useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

function setUpIniLanguage(monaco) {
  // Register a new language
  monaco.languages.register({ id: "iniLanguage" });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider("iniLanguage", {
    tokenizer: {
      root: [
        [/^\[.*\]$/, "rule-name"],
        [/\[.*\]/, "optional-word"],
        [/\(.*\)/, "group"],
        [/\{.*\}/, "tag"],
        [/<.*>/, "variable"],
        [/^.*=/, "equation"],
      ],
    },
  });

  // Define a new theme that contains only rules that match this language
  monaco.editor.defineTheme("iniTheme", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "rule-name", foreground: "66D9EF" },
      { token: "optional-word", foreground: "AE81FF" },
      { token: "group", foreground: "A6E22E" },
      { token: "tag", foreground: "FD971F" },
      { token: "equation", foreground: "E6DB74" },
      { token: "variable", foreground: "F92672" },
    ],
    colors: {
      "editor.foreground": "#ffffff",
    },
  });

  const config = {
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "<", close: ">" },
      { open: "'", close: "'" },
      { open: '"', close: '"' },
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "'", close: "'", notIn: ["string", "comment"] },
      { open: '"', close: '"', notIn: ["string", "comment"] },
    ],
  };
  monaco.languages.setLanguageConfiguration("iniLanguage", config);
}

function getDefaultVaue() {
  return `[SetLightColor]
colors = (red | green | blue)
set the light to <colors>

[GetLightColor]
is the light <SetLightColor.colors>`;
}

export default function RulesEditor({ setTriggers }) {
  const monaco = useMonaco();

  const [loading, setLoading] = useState(true);

  const defaultValue = getDefaultVaue();

  const setTriggersFromText = (text) => {
    const ruleNames = text
      .split("\n")
      .filter((element) => element.startsWith("[") && element.endsWith("]"));

    const cleanedRuleNames = ruleNames.map((ruleName) => ruleName.slice(1, -1));
    setTriggers(cleanedRuleNames);
  };

  const parseTriggers = useCallback(
    (e) => {
      setTriggersFromText(e);
    },
    [setTriggers]
  );

  useEffect(() => {
    if (monaco) {
      setTriggersFromText(defaultValue);
      setUpIniLanguage(monaco);
    }
    setLoading(false);
  }, [monaco]);

  if (loading) return <h1>Loading</h1>;
  return (
    <Editor
      height="93vh"
      width="50%"
      defaultLanguage="iniLanguage"
      defaultValue={defaultValue}
      theme="iniTheme"
      options={{
        minimap: {
          enabled: true,
        },
        renderWhitespace: "all",
      }}
      onChange={parseTriggers}
    />
  );
}
