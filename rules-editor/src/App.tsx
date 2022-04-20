import './App.css';

import { useEffect, useState } from 'react';

import Header from './Header';
import SentencesEditor from './SentencesEditor';
import YamlEditor from './YamlEditor';
import axios from 'axios';
import Loading from './Loading';

function App() {
  const [sentences, setSentences] = useState('');
  const [intents, setIntents] = useState('');
  const [config, setConfig] = useState('');

  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState('intents');

  useEffect(() => {
    const loadSentencesAndIntents = async () => {
      setLoading(true);
      const sentences = await axios.get('/rhasspy/api/sentences');
      setSentences(sentences['data']);

      const intents = await axios.get('/haconfig/api/file/intents');
      setIntents(intents['data']);

      const configs = await axios.get('/haconfig/api/file/config');
      setConfig(configs['data']);
      setLoading(false);
    };

    loadSentencesAndIntents();
  }, [selectedFile]);

  if (loading) {
    return (
      <div>
        <Header
          sentences={sentences}
          intents={intents}
          config={config}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
        {selectedFile === 'intents' ? (
          <YamlEditor setConfig={setIntents} config={intents} />
        ) : (
          <YamlEditor setConfig={setConfig} config={config} />
        )}
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Header
        sentences={sentences}
        intents={intents}
        config={config}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
      <div className='rowC'>
        <SentencesEditor setSentences={setSentences} sentences={sentences} />
        {selectedFile === 'intents' ? (
          <YamlEditor
            key='intentsEditor'
            setConfig={setIntents}
            config={intents}
          />
        ) : (
          <YamlEditor
            key='configEditor'
            setConfig={setConfig}
            config={config}
          />
        )}
      </div>
    </div>
  );
}

export default App;
