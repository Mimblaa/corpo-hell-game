import React, { useState } from 'react';
import AppLayout from './AppLayout';
import './App.css';

function App() {
  const [isAppVisible, setIsAppVisible] = useState(false);

  const handleStartClick = () => {
    // Reset localStorage to default values
    localStorage.clear();
    localStorage.setItem("activeSection", "chat");
    localStorage.setItem("searchQuery", "");
    localStorage.setItem("tasks", JSON.stringify([]));
    localStorage.setItem("chats", JSON.stringify([]));
    localStorage.setItem("messages", JSON.stringify([]));
    localStorage.setItem("selectedChatId", "1");
    localStorage.setItem("isModalOpen", "false");
    localStorage.setItem("modalContent", null);
    localStorage.setItem("currentDate", new Date().toISOString());

    setIsAppVisible(true);
  };

  const handleContinueClick = () => {
    setIsAppVisible(true);
  };

  return (
    <div className="app-container">
      {!isAppVisible ? (
        <div className="chat-container">
          <h1>Witaj w corpo hell!</h1>
          <button onClick={handleStartClick}>Rozpocznij grę</button>
          <button onClick={handleContinueClick}>Kontynuuj grę</button>
        </div>
      ) : (
        <AppLayout />
      )}
    </div>
  );
}

export default App;
