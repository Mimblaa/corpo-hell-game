import React, { useState } from 'react';
import AppLayout from './AppLayout';
import './App.css';

import participantAvatar from './assets/icons/user-avatar.png';
import yourAvatar from './assets/icons/profile-icon.png';

function App() {
  const [isAppVisible, setIsAppVisible] = useState(false);

  const scenarios = [
    {
      name: "Strategiczne Spotkanie Statusowe",
      question: "Jak wygląda postęp w tym projekcie? Mam nadzieję, że wszystko idzie zgodnie z planem.",
      options: [
        { id: 1, text: "Tak, wszystko zgodnie z harmonogramem!", effect: "+5 Reputacja", penalty: "-5 Zaufanie Szefa" },
        { id: 2, text: "Jeszcze nad tym pracujemy, ale są pewne wyzwania...", effect: "+3 Unikanie Odpowiedzialności", penalty: "-2 Zaufanie Szefa" },
        { id: 3, text: "Mieliśmy problem z priorytetami, ale to pod kontrolą.", effect: "+4 Polityczny Spryt", penalty: "-4 Zaufanie Zespołu" },
        { id: 4, text: "Nie miałem jeszcze czasu się tym zająć…", effect: "+5 Autentyczność", penalty: "-10 Reputacja" },
        { id: 5, text: "Udawaj problemy techniczne i zniknij z calla", effect: "+10 Cwaniactwo", penalty: "-5 Zaufanie Szefa, -3 Zaufanie Zespołu" },
      ],
    },
    {
      name: "Niezapowiedziany Call z Szefem",
      question: "Hej, mamy chwilę? Chciałem szybko omówić twoją ostatnią pracę.",
      options: [
        { id: 1, text: "Oczywiście, zawsze mam czas!", effect: "+5 Reputacja", penalty: "+5 Stres" },
        { id: 2, text: "Czy możemy przełożyć? Jestem w trakcie czegoś ważnego.", effect: "+3 Unikanie Odpowiedzialności", penalty: "-3 Zaufanie Szefa" },
        { id: 3, text: "Tak, ale czy mógłbyś sprecyzować temat?", effect: "+4 Polityczny Spryt", penalty: "+2 Stres" },
        { id: 4, text: "*Brak reakcji, udawaj, że nie widziałeś zaproszenia*", effect: "+5 Cwaniactwo", penalty: "-5 Zaufanie Szefa" },
        { id: 5, text: "*Udawaj problemy z internetem i rozłącz się*", effect: "+7 Unikanie Odpowiedzialności", penalty: "-4 Zaufanie Szefa, -3 Zaufanie Zespołu" },
      ],
    },
    {
      name: "Mail od HR o Dobrowolnych Nadgodzinach",
      question: "Czy chcesz poświęcić dodatkowy czas dla dobra zespołu?",
      options: [
        { id: 1, text: "Oczywiście! Zostanę, żeby pomóc firmie.", effect: "+7 Reputacja", penalty: "+10 Stres, -5 Cierpliwość" },
        { id: 2, text: "Nie mogę, mam już inne zobowiązania.", effect: "+4 Autentyczność", penalty: "-3 Reputacja" },
        { id: 3, text: "Czy będzie za to dodatkowa premia?", effect: "+5 Polityczny Spryt", penalty: "-4 Zaufanie Szefa" },
        { id: 4, text: "*Nie odpowiadaj, może zapomną*", effect: "+6 Cwaniactwo", penalty: "-5 Zaufanie Zespołu" },
        { id: 5, text: "*Zaproponuj, że pomożesz, ale tylko w zamian za dodatkowe benefity*", effect: "+5 Unikanie Odpowiedzialności", penalty: "-3 Zaufanie Szefa, +2 Polityczny Spryt" },
      ],
    },
  ];

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
      {
        id: 9,
        title: "Napisz funkcję sumującą",
        dueDate: "2023-12-10T18:00:00",
        course: "Programowanie",
        status: "Nie przesłano",
        priority: "medium",
        tags: ["programowanie", "zadanie"],
        description: "Napisz funkcję w JavaScript, która zwraca sumę dwóch liczb.",
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

  const defaultStats = {
    reputation: 50,
    bossTrust: 50,
    teamTrust: 50,
    efficiency: 50,
    politicalSkill: 30,
    responsibilityAvoidance: 30,
    buzzwordPower: 30,
    stress: 20,
    patience: 80,
    productivityTheatre: 40,
  };

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
    localStorage.setItem("scenarios", JSON.stringify(scenarios)); // Save scenarios to localStorage
    localStorage.setItem("playerStats", JSON.stringify(defaultStats)); // Save default stats to localStorage

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
