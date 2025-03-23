import React, { useState } from "react";
import AppLayout from "./AppLayout";
import Questionnaire from "./Questionnaire";
import "./App.css";

import participantAvatar from './assets/icons/user-avatar.png';
import yourAvatar from './assets/icons/profile-icon.png';

function App() {
  const [isAppVisible, setIsAppVisible] = useState(false);
  const [isQuestionnaireComplete, setIsQuestionnaireComplete] = useState(() => {
    return !!localStorage.getItem("playerStats");
  });

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

  const questionnaireData = [
    {
      id: "professional",
      name: "Profesjonalne Umiejętności",
      questions: [
        {
          id: "coffee",
          text: "Jak pijesz kawę?",
          options: [
            { value: "black", text: "Czarna", effects: { reputation: 5 } },
            { value: "milk", text: "Z mlekiem", effects: { patience: 5 } }
          ]
        },
        {
          id: "meeting",
          text: "Co robisz na spotkaniach?",
          options: [
            { value: "talk", text: "Dużo mówię", effects: { bossTrust: 5 } },
            { value: "listen", text: "Słucham", effects: { teamTrust: 5 } }
          ]
        },
        {
          id: "deadlines",
          text: "Jak radzisz sobie z terminami?",
          options: [
            { value: "crunch", text: "Pracuję na ostatnią chwilę", effects: { stress: 10 } },
            { value: "plan", text: "Planuję z wyprzedzeniem", effects: { efficiency: 5 } }
          ]
        }
      ]
    },
    {
      id: "cunning",
      name: "Korpo Cwaniactwo",
      questions: [
        {
          id: "buzzwords",
          text: "Czy używasz korporacyjnych buzzwordów?",
          options: [
            { value: "yes", text: "Tak", effects: { buzzwordPower: 10 } },
            { value: "no", text: "Nie", effects: { authenticity: 5 } }
          ]
        },
        {
          id: "responsibility",
          text: "Jak podchodzisz do odpowiedzialności?",
          options: [
            { value: "delegate", text: "Deleguję", effects: { responsibilityAvoidance: 10 } },
            { value: "take", text: "Biorę na siebie", effects: { efficiency: 5 } }
          ]
        },
        {
          id: "politics",
          text: "Jak radzisz sobie z polityką w pracy?",
          options: [
            { value: "network", text: "Buduję sieć kontaktów", effects: { politicalSkill: 10 } },
            { value: "avoid", text: "Unikam polityki", effects: { teamTrust: 5 } }
          ]
        }
      ]
    },
    {
      id: "mental",
      name: "Mentalność Gracza",
      questions: [
        {
          id: "stressHandling",
          text: "Jak radzisz sobie ze stresem?",
          options: [
            { value: "meditate", text: "Medytuję", effects: { stress: -5 } },
            { value: "ignore", text: "Ignoruję", effects: { stress: 5 } }
          ]
        },
        {
          id: "multitasking",
          text: "Czy jesteś dobry w multitaskingu?",
          options: [
            { value: "yes", text: "Tak", effects: { efficiency: 5 } },
            { value: "no", text: "Nie", effects: { patience: 5 } }
          ]
        },
        {
          id: "productivity",
          text: "Jak mierzysz swoją produktywność?",
          options: [
            { value: "visible", text: "Widoczna produktywność", effects: { productivityTheatre: 10 } },
            { value: "actual", text: "Rzeczywista produktywność", effects: { efficiency: 5 } }
          ]
        }
      ]
    },
    {
      id: "personal",
      name: "Osobiste Preferencje",
      questions: [
        {
          id: "workEnvironment",
          text: "Jakie środowisko pracy preferujesz?",
          options: [
            { value: "quiet", text: "Ciche i spokojne", effects: { patience: 5 } },
            { value: "dynamic", text: "Dynamiczne i szybkie", effects: { stress: 5 } }
          ]
        },
        {
          id: "feedback",
          text: "Jak reagujesz na krytykę?",
          options: [
            { value: "accept", text: "Akceptuję i uczę się", effects: { reputation: 5 } },
            { value: "defensive", text: "Bronię się", effects: { stress: 5 } }
          ]
        }
      ]
    }
  ];

  const handleQuestionnaireComplete = () => {
    setIsQuestionnaireComplete(true);
    setIsAppVisible(true);
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
    localStorage.setItem("questionnaireData", JSON.stringify(questionnaireData)); // Save questionnaire data to localStorage

    setIsQuestionnaireComplete(false); // Trigger questionnaire
  };

  const handleContinueClick = () => {
    setIsAppVisible(true);
  };

  return (
    <div className={isAppVisible ? "app-container" : "start-page"}>
      {!isAppVisible ? (
        !isQuestionnaireComplete ? (
          <Questionnaire onComplete={handleQuestionnaireComplete} />
        ) : (
          <div className="chat-container">
            <h1>Witaj w Corpo Hell!</h1>
            <p>Przygotuj się na wyzwania korporacyjnego życia.</p>
            <button onClick={handleStartClick}>Rozpocznij od nowa</button>
            <button onClick={handleContinueClick}>Kontynuuj grę</button>
          </div>
        )
      ) : (
        <AppLayout />
      )}
    </div>
  );
}

export default App;
