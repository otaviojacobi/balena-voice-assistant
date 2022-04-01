import './App.css';

import { useState } from 'react';

import Header from './Header';
import RulesEditor from './RulesEditor';
import TriggerEditor from './TriggerEditor';
import { defaultIntents, defaultRules } from './defaultValues';

function App() {
  const [sentences, setSentences] = useState(defaultRules());
  const [intents, setIntents] = useState(defaultIntents());

  return (
    <div>
      <Header sentences={sentences} intents={intents} />
      <div className='rowC'>
        <RulesEditor setSentences={setSentences} />
        <TriggerEditor setIntents={setIntents} />
      </div>
    </div>
  );
}

export default App;
