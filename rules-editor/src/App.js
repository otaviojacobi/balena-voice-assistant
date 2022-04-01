import "./App.css";

import React, { useState } from "react";

import Header from "./Header";
import RulesEditor from "./RulesEditor";
import TriggerEditor from "./TriggerEditor";

function App() {
  const [triggers, setTriggers] = useState([]);

  return (
    <div>
      <Header triggers={triggers} />
      <div className="rowC">
        <RulesEditor setTriggers={setTriggers} />
        <TriggerEditor triggers={triggers} />
      </div>
    </div>
  );
}

export default App;
