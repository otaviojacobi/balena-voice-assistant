import './App.css';

import { useEffect, useState } from 'react';

import Header from './Header';
import SentencesEditor from './SentencesEditor';
import IntentsEditor from './IntentsEditor';
import axios from 'axios';
import Loading from './Loading';

function App() {
  const [sentences, setSentences] = useState('');
  const [intents, setIntents] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSentencesAndIntents = async () => {
      const sentences = await axios.get('/rhasspy/api/sentences');
      setSentences(sentences['data']);

      const intents = await axios.get(
        '/haconfig/api/file?filename=/hass-config/intents.yaml',
      );
      setIntents(intents['data']);

      setLoading(false);
    };

    loadSentencesAndIntents();
  }, []);

  if (loading) {
    return (
      <div>
        <Header sentences={sentences} intents={intents} />
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Header sentences={sentences} intents={intents} />
      <div className='rowC'>
        <SentencesEditor setSentences={setSentences} sentences={sentences} />
        <IntentsEditor setIntents={setIntents} intents={intents} />
      </div>
    </div>
  );
}

export default App;
