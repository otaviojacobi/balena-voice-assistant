import React, { useCallback, useEffect, useState } from 'react';
import Editor, { Monaco, useMonaco } from '@monaco-editor/react';
import { defaultRules } from './defaultValues';

function setUpIniLanguage(monaco: Monaco) {
  // Register a new language
  monaco.languages.register({ id: 'iniLanguage' });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('iniLanguage', {
    tokenizer: {
      root: [
        [/^\[.*\]$/, 'rule-name'],
        [/\[.*\]/, 'optional-word'],
        [/\(.*\)/, 'group'],
        [/\{.*\}/, 'tag'],
        [/<.*>/, 'variable'],
        [/^.*=/, 'equation'],
      ],
    },
  });

  // Define a new theme that contains only rules that match this language
  monaco.editor.defineTheme('iniTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'rule-name', foreground: '66D9EF' },
      { token: 'optional-word', foreground: 'AE81FF' },
      { token: 'group', foreground: 'A6E22E' },
      { token: 'tag', foreground: 'FD971F' },
      { token: 'equation', foreground: 'E6DB74' },
      { token: 'variable', foreground: 'F92672' },
    ],
    colors: {
      'editor.foreground': '#ffffff',
    },
  });

  const config = {
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '<', close: '>' },
      { open: "'", close: "'" },
      { open: '"', close: '"' },
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: "'", close: "'", notIn: ['string', 'comment'] },
      { open: '"', close: '"', notIn: ['string', 'comment'] },
    ],
  };
  monaco.languages.setLanguageConfiguration('iniLanguage', config);
}

export default function RulesEditor({
  setSentences,
}: {
  setSentences: Function;
}) {
  const monaco = useMonaco();
  const [loading, setLoading] = useState(true);

  const updateSentences = useCallback((e) => setSentences(e), [setSentences]);

  useEffect(() => {
    if (monaco) {
      setUpIniLanguage(monaco);
    }
    setLoading(false);
  }, [monaco]);

  if (loading) {
    return <h1>Loading</h1>;
  }

  return (
    <Editor
      height='93vh'
      width='50%'
      defaultLanguage='iniLanguage'
      defaultValue={defaultRules()}
      theme='iniTheme'
      options={{
        minimap: {
          enabled: true,
        },
        renderWhitespace: 'all',
      }}
      onChange={updateSentences}
    />
  );
}
