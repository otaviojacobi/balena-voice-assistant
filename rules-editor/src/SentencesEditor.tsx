import { useCallback, useEffect, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import setUpIniLanguage from './setUpIniLanguage';
import Loading from './Loading';

interface SentencesEditorProps {
  sentences: string;
  setSentences: Function;
}

export default function SentencesEditor({
  sentences,
  setSentences,
}: SentencesEditorProps) {
  const monaco = useMonaco();
  const [loading, setLoading] = useState(true);

  const updateSentences = useCallback((e) => setSentences(e), [setSentences]);

  useEffect(() => {
    setLoading(true);
    if (monaco) {
      setUpIniLanguage(monaco);
    }
    setLoading(false);
  }, [monaco]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Editor
      height='93vh'
      width='50%'
      defaultLanguage='iniLanguage'
      defaultValue={sentences}
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
