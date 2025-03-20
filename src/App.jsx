import React, { useState } from 'react';
import AppLayout from './AppLayout';
import './App.css';

import participantAvatar from './assets/icons/user-avatar.png';
import yourAvatar from './assets/icons/profile-icon.png';

function App() {
  const [isAppVisible, setIsAppVisible] = useState(false);

    const defaultChats = [
      { 
        id: 1, 
        name: "Group Chat" 
      },
      { 
        id: 2, 
        name: "New Chat 2" 
      },
    ];
  
    const defaultMessages = [
      {
      id: 1,
      chatId: 1,
      sender: "AI",
      message: "message 1 to pisze ai",
      time: "26.04.24 09:34",
      avatar: participantAvatar,
      isAI: true,
    },
    {
      id: 2,
      chatId: 1,
      sender: "You",
      message: "Inna wiadomosc twoja",
      time: "26.04.24 09:35",
      avatar: yourAvatar,
      isAI: false,
    },
    {
      id: 3,
      chatId: 2,
      sender: "AI",
      message: "message 1 to pisze ai",
      time: "26.04.24 09:34",
      avatar: participantAvatar,
      isAI: true,
    },
    {
      id: 4,
      chatId: 2,
      sender: "AI",
      message: "Inna wiadomosc Ai",
      time: "26.04.24 09:35",
      avatar: participantAvatar,
      isAI: true,
    }
    ];

    const defaultTasks = [
      {
        id: 1,
        title: "Przygotowanie prezentacji",
        dueDate: "2026-12-15T10:00:00",
        course: "Grafika",
        status: "Nie przesłano",
        priority: "high", 
        tags: ["prezentacja", "projekt"],
      },
      {
        id: 2,
        title: "Utworz zbiór danych",
        dueDate: "2026-12-20T23:59:00",
        course: "Statystyka",
        status: "Nie przesłano",
        priority: "medium", 
        tags: ["zadanie", "statystyka"],
      },
      {
        id: 3,
        title: "Raport z badań",
        dueDate: "2023-11-30T23:59:00",
        course: "Internet",
        status: "Po terminie",
        priority: "low", 
        tags: ["raport", "badania"],
      },
      {
        id: 4,
        title: "Prześij notatki z projektu",
        dueDate: "2023-11-25T18:00:00",
        course: "Notatki",
        status: "Po terminie",
        priority: "high", 
        tags: ["projekt", "notatki"],
      },
      {
        id: 5,
        title: "Oblicz braki w danych",
        dueDate: "2023-11-20T12:00:00",
        course: "Matematyka",
        status: "Ukończone",
        priority: "medium", 
        tags: ["matematyka"],
      },
      {
        id: 6,
        title: "Przygotuj agende spotkania",
        dueDate: "2023-11-18T14:00:00",
        course: "Internet",
        status: "Ukończone",
        priority: "low", 
        tags: ["spotkania"],
      }, 
      {
        id: 7,
        title: "Odpisz klientowi",
        dueDate: "2023-11-18T14:00:00",
        course: "Korespondencja",
        status: "Po terminie",
        priority: "low", 
        tags: ["mail"],
      }, 
      {
        id: 8,
        title: "Przeslij oferty",
        dueDate: "2025-11-18T14:00:00",
        course: "Korespondencja",
        status: "Po terminie",
        priority: "low", 
        tags: ["mail"],
      },
  ];

  const defaultCalls = [
    { 
      id: 1, 
      name: "Jan Kowalski", 
      time: "2023-11-01 14:30", 
      type: "outgoing",
      scenario: {"id":4,"text":"Nie miałem jeszcze czasu się tym zająć…","effect":"+5 Autentyczność","penalty":"-10 Reputacja"},
      rating: {"effect":"+5 Autentyczność","penalty":"-10 Reputacja"} 
    },
    { 
      id: 2, 
      name: "Anna Nowak", 
      time: "2023-11-02 10:15", 
      type: "incoming" ,
      scenario: {"id":4,"text":"Nie miałem jeszcze czasu się tym zająć…","effect":"+5 Autentyczność","penalty":"-10 Reputacja"},
      rating: {"effect":"+5 Autentyczność","penalty":"-10 Reputacja"}
    },
    { 
      id: 3, 
      name: "Piotr Wiśniewski", 
      time: "2023-11-03 16:45", 
      type: "missed",
      scenario: {"id":4,"text":"Nie miałem jeszcze czasu się tym zająć…","effect":"+5 Autentyczność","penalty":"-10 Reputacja"},
      rating: {"effect":"+5 Autentyczność","penalty":"-10 Reputacja"} 
    },
  ];

  const defaultContacts = [
    { 
      id: 1, 
      name: "Jan Kowalski" 
    },
    { 
      id: 2, 
      name: "Anna Nowak" 
    },
    { 
      id: 3, 
      name: "Piotr Wiśniewski" 
    },
    { 
      id: 4, 
      name: "Maria Zielińska" 
    },
  ];

  const handleStartClick = () => {
    // Reset localStorage to default values
    localStorage.clear();
    localStorage.setItem("activeSection", "chat");
    localStorage.setItem("searchQuery", "");
    localStorage.setItem("tasks", JSON.stringify(defaultTasks));
    localStorage.setItem("chats", JSON.stringify(defaultChats));
    localStorage.setItem("messages", JSON.stringify(defaultMessages));
    localStorage.setItem("selectedChatId", "1");
    localStorage.setItem("isModalOpen", "false");
    localStorage.setItem("modalContent", null);
    localStorage.setItem("currentDate", new Date().toISOString());
    localStorage.setItem("callHistory", JSON.stringify(defaultCalls));
    localStorage.setItem("callFilter", "all");
    localStorage.setItem("contacts", JSON.stringify(defaultContacts));

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
