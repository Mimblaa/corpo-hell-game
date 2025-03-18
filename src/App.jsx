import React, { useState } from 'react';
import AppLayout from './AppLayout';
import './App.css';

function App() {
  const [isAppVisible, setIsAppVisible] = useState(false);

  const handleClick = () => {
    setIsAppVisible(true);
  };

  return (
    <div className="app-container">
      {!isAppVisible ? (
        <div className="chat-container">
          <h1>Witaj w corpo hell!</h1>
          <button onClick={handleClick}>Rozpocznij grę</button>
        </div>
      ) : (
        <AppLayout />
      )}
    </div>
  );
}

export default App;
