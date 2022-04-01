import './App.css';

import { useState } from 'react';

import Header from './Header';
import RulesEditor from './RulesEditor';
import TriggerEditor from './TriggerEditor';
import { defaultRules } from './defaultValues';

function App() {
  const [intents, setIntents] = useState(defaultRules());

  return (
    <div>
      <Header intents={intents} />
      <div className='rowC'>
        <RulesEditor setIntents={setIntents} />
        <TriggerEditor />
      </div>
    </div>
  );
}

export default App;
