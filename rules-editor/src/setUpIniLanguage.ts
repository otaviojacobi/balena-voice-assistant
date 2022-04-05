import { Monaco } from '@monaco-editor/react';

export default function setUpIniLanguage(monaco: Monaco) {
  monaco.languages.register({ id: 'iniLanguage' });

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
