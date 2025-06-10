"use client";
import React, { useState, useEffect } from "react";
import styles from "./CallsSection.module.css";
import deleteIcon from "../assets/icons/delete.png"; // Import the delete icon

// --- AI Conversation Helpers ---
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
async function fetchOpenAIResponse(apiMessages) {
  if (!OPENAI_API_KEY) {
    return "To jest przykładowa odpowiedź AI, ponieważ klucz API OpenAI nie został skonfigurowany poprawnie w pliku .env.";
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: apiMessages,
        max_tokens: 300,
        temperature: 0.7
      })
    });
    if (!response.ok) return "Przepraszam, mam chwilowe problemy z odpowiedzią. Spróbujmy później.";
    const data = await response.json();
    return data.choices[0]?.message?.content.trim() || "Nie udało mi się wygenerować odpowiedzi.";
  } catch {
    return "Wystąpił błąd podczas komunikacji z AI. Spróbuj ponownie.";
  }
}

const CallsSection = ({
  incomingCall,
  onAcceptIncomingCall,
  onRejectIncomingCall,
  setActiveCall,
  activeCall
}) => {


  // --- AI Conversation State ---
  const [conversationStep, setConversationStep] = useState(0); // 0 = not started, 1-5 = in progress
  // [{question, options, answer, effect, penalty}]
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentOptions, setCurrentOptions] = useState([]);
  const [currentEffect, setCurrentEffect] = useState("");
  const [currentPenalty, setCurrentPenalty] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const [callHistory, setCallHistory] = useState(() => {
    const savedHistory = localStorage.getItem("callHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [filter, setFilter] = useState(() => {
    return localStorage.getItem("callFilter") || "all";
  });

  const [contacts, setContacts] = useState(() => {
    const savedChats = localStorage.getItem("chats");
    return savedChats ? JSON.parse(savedChats).map(chat => ({ id: chat.id, name: chat.name })) : [];
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [selectedScenarioOption, setSelectedScenarioOption] = useState(null);

  const [scenarios, setScenarios] = useState(() => {
    const savedScenarios = localStorage.getItem("scenarios");
    return savedScenarios ? JSON.parse(savedScenarios) : [];
  });

  useEffect(() => {
    localStorage.setItem("callHistory", JSON.stringify(callHistory));
  }, [callHistory]);

  useEffect(() => {
    localStorage.setItem("callFilter", filter);
  }, [filter]);

  useEffect(() => {
    const storedActiveCall = localStorage.getItem("activeCall");
    if (storedActiveCall) {
      const activeCallData = JSON.parse(storedActiveCall);
      handleStartCall(activeCallData);
      localStorage.removeItem("activeCall");
    }
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDeleteCall = (id) => {
    setCallHistory((prevHistory) => prevHistory.filter((call) => call.id !== id));
  };


  // --- Stat validation helpers ---
  const allowedStats = [
    "Reputacja",
    "Zaufanie Szefa",
    "Zaufanie Zespołu",
    "Polityczny Spryt",
    "Unikanie Odpowiedzialności",
    "Cwaniactwo",
    "Stres",
    "Cierpliwość",
    "Produktywność Teatralna"
  ];
  function validateEffectOrPenalty(str, isEffect = true) {
    // isEffect: true = efekt (0-5), false = kara (-5-0)
    const match = str.match(/^([A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+)\s*([+-]?\d+)/);
    if (!match) return isEffect ? "Reputacja +0" : "Stres -0";
    let [_, stat, value] = match;
    stat = stat.trim();
    value = parseInt(value, 10);
    if (!allowedStats.includes(stat)) stat = isEffect ? "Reputacja" : "Stres";
    if (isEffect) value = Math.max(0, Math.min(5, value));
    else value = Math.min(0, Math.max(-5, value));
    return `${stat} ${value >= 0 ? "+" : ""}${value}`;
  }

  // Rozpocznij rozmowę i pobierz pierwsze pytanie/odpowiedzi od AI
  const handleStartCall = async (contact) => {
    setActiveCall({ ...contact, time: new Date().toISOString(), type: "outgoing" });
    setSelectedScenarioOption(null);
    setConversationStep(1);
    setConversationHistory([]);
    setIsLoadingAI(true);
    setCurrentQuestion("");
    setCurrentOptions([]);
    setCurrentEffect("");
    setCurrentPenalty("");

    // Prompt do AI: generuj pytanie, 5 odpowiedzi, efekty i kary (po jednej dla każdej opcji)
    const statsList = allowedStats.map(s => `"${s}"`).join(", ");
    const systemPrompt = `Jesteś pracownikiem biura o imieniu ${contact.name}. Rozmawiasz przez telefon z kolegą z pracy. Wymyśl pytanie do rozmowy telefonicznej w pracy (po polsku), podaj 5 możliwych odpowiedzi do wyboru oraz dla każdej odpowiedzi podaj efekt (nagrodę) i karę.\nEfekt i kara muszą być wybrane z tej listy statystyk: ${statsList}.\nEfekt to zawsze jedna statystyka z tej listy z wartością od 0 do 5 (np. "Reputacja +3"). Kara to zawsze jedna statystyka z tej listy z wartością od -5 do 0 (np. "Stres -2").\nOdpowiedz TYLKO w formacie JSON, bez żadnych opisów: {"question":"...", "options":["...","...","...","...","..."], "effects":["Reputacja +3",...], "penalties":["Cierpliwość -1",...]}`;
    const apiMessages = [
      { role: "system", content: systemPrompt }
    ];
    const aiResponse = await fetchOpenAIResponse(apiMessages);
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      // Spróbuj wyciągnąć JSON z tekstu
      const match = aiResponse.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = null;
        }
      }
    }
    if (parsed && parsed.question && parsed.options && parsed.effects && parsed.penalties) {
      setCurrentQuestion(parsed.question);
      setCurrentOptions(parsed.options);
      setCurrentEffect(validateEffectOrPenalty(parsed.effects[0] || "", true));
      setCurrentPenalty(validateEffectOrPenalty(parsed.penalties[0] || "", false));
    } else {
      setCurrentQuestion(aiResponse || "Błąd AI lub niepoprawny format odpowiedzi.");
      setCurrentOptions([]);
      setCurrentEffect("");
      setCurrentPenalty("");
    }
    setIsLoadingAI(false);
  };

  // --- Ensure AI conversation starts after accepting incoming call ---
  useEffect(() => {
    // Only trigger if activeCall is set, conversation not started, and not loading
    if (
      activeCall &&
      conversationStep === 0 &&
      !isLoadingAI
    ) {
      // Defensive: avoid double-trigger if already started
      handleStartCall(activeCall);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCall]);

  // Obsługa wyboru odpowiedzi przez użytkownika
  const handleSelectOption = async (optionText) => {
    // znajdź indeks wybranej opcji
    const idx = currentOptions.findIndex(opt => opt === optionText);
    const newHistory = [
      ...conversationHistory,
      { question: currentQuestion, options: currentOptions, answer: optionText, effect: currentEffect, penalty: currentPenalty }
    ];
    setConversationHistory(newHistory);
    if (conversationStep >= 5) {
      setConversationStep(6);
      return;
    }
    setIsLoadingAI(true);
    setConversationStep(conversationStep + 1);

    // Prompt do AI: kontynuuj rozmowę na podstawie historii
    let historyText = newHistory.map((h, idx) => `Krok ${idx + 1}: Pytanie: ${h.question} | Odpowiedź: ${h.answer}`).join("\n");
    const statsList = allowedStats.map(s => `"${s}"`).join(", ");
    const systemPrompt = `Jesteś pracownikiem biura o imieniu ${activeCall?.name || ""}. Kontynuujesz rozmowę telefoniczną z kolegą z pracy. Oto dotychczasowa historia rozmowy:\n${historyText}\nZadaj kolejne pytanie (po polsku), podaj 5 możliwych odpowiedzi do wyboru oraz dla każdej odpowiedzi podaj efekt (nagrodę) i karę.\nEfekt i kara muszą być wybrane z tej listy statystyk: ${statsList}.\nEfekt to zawsze jedna statystyka z tej listy z wartością od 0 do 5 (np. "Reputacja +3"). Kara to zawsze jedna statystyka z tej listy z wartością od -5 do 0 (np. "Stres -2").\nOdpowiedz TYLKO w formacie JSON, bez żadnych opisów: {"question":"...", "options":["...","...","...","...","..."], "effects":["Reputacja +3",...], "penalties":["Cierpliwość -1",...]}`;
    const apiMessages = [
      { role: "system", content: systemPrompt }
    ];
    const aiResponse = await fetchOpenAIResponse(apiMessages);
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      // Spróbuj wyciągnąć JSON z tekstu
      const match = aiResponse.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = null;
        }
      }
    }
    if (parsed && parsed.question && parsed.options && parsed.effects && parsed.penalties) {
      setCurrentQuestion(parsed.question);
      setCurrentOptions(parsed.options);
      setCurrentEffect(validateEffectOrPenalty(parsed.effects[idx] || "", true));
      setCurrentPenalty(validateEffectOrPenalty(parsed.penalties[idx] || "", false));
    } else {
      setCurrentQuestion(aiResponse || "Błąd AI lub niepoprawny format odpowiedzi.");
      setCurrentOptions([]);
      setCurrentEffect("");
      setCurrentPenalty("");
    }
    setIsLoadingAI(false);
  };

  const handleEndCall = () => {
    if (activeCall) {
      // Pobierz efekt i karę z ostatniego kroku rozmowy AI
      const lastStep = conversationHistory[conversationHistory.length - 1];
      const effectStr = lastStep?.effect || "";
      const penaltyStr = lastStep?.penalty || "";

      // Zaktualizuj statystyki gracza
      const updatedStats = { ...JSON.parse(localStorage.getItem("playerStats")) };
      const statMapping = {
        "Reputacja": "reputation",
        "Zaufanie Szefa": "bossTrust",
        "Zaufanie Zespołu": "teamTrust",
        "Polityczny Spryt": "politicalSkill",
        "Unikanie Odpowiedzialności": "responsibilityAvoidance",
        "Cwaniactwo": "buzzwordPower",
        "Stres": "stress",
        "Cierpliwość": "patience",
        "Autentyczność": "reputation",
        "Produktywność Teatralna": "productivityTheatre",
      };
      // Efekt
      Object.keys(statMapping).forEach((key) => {
        if (effectStr.includes(key)) {
          const match = effectStr.match(/[-+]?\d+/);
          if (match) updatedStats[statMapping[key]] += parseInt(match[0], 10);
        }
        if (penaltyStr.includes(key)) {
          const match = penaltyStr.match(/[-+]?\d+/);
          if (match) updatedStats[statMapping[key]] += parseInt(match[0], 10);
        }
      });
      localStorage.setItem("playerStats", JSON.stringify(updatedStats));

      setCallHistory((prevHistory) => [
        ...prevHistory,
        {
          ...activeCall,
          id: Date.now(),
          scenario: lastStep || { text: "Brak scenariusza" },
          rating: { effect: effectStr || "Brak oceny", penalty: penaltyStr || "Brak kary" },
        },
      ]);
    }
    setActiveCall(null);
    setIsMuted(false);
    setIsCameraOn(true);
  };

  // Specjalne pytanie AI po wyciszeniu lub wyłączeniu kamery
  const askAboutMuteOrCamera = async (type) => {
    setIsLoadingAI(true);
    let historyText = conversationHistory.map((h, idx) => `Krok ${idx + 1}: Pytanie: ${h.question} | Odpowiedź: ${h.answer}`).join("\n");
    const statsList = allowedStats.map(s => `"${s}"`).join(", ");
    let specialPrompt = "";
    if (type === "mute") {
      specialPrompt = "W trakcie rozmowy użytkownik wyciszył mikrofon. Zadaj pytanie dotyczące tego, że rozmówca się wyciszył (np. 'Dlaczego się wyciszyłeś?'), podaj 5 możliwych odpowiedzi oraz efekty i kary jak wcześniej.";
    } else if (type === "camera") {
      specialPrompt = "W trakcie rozmowy użytkownik wyłączył kamerę. Zadaj pytanie dotyczące tego, że rozmówca wyłączył kamerę (np. 'Dlaczego wyłączyłeś kamerę?'), podaj 5 możliwych odpowiedzi oraz efekty i kary jak wcześniej.";
    }
    const systemPrompt = `Jesteś pracownikiem biura o imieniu ${activeCall?.name || ""}. Kontynuujesz rozmowę telefoniczną z kolegą z pracy. Oto dotychczasowa historia rozmowy:\n${historyText}\n${specialPrompt}\nEfekt i kara muszą być wybrane z tej listy statystyk: ${statsList}.\nEfekt to zawsze jedna statystyka z tej listy z wartością od 0 do 5 (np. "Reputacja +3"). Kara to zawsze jedna statystyka z tej listy z wartością od -5 do 0 (np. "Stres -2").\nOdpowiedz TYLKO w formacie JSON, bez żadnych opisów: {"question":"...", "options":["...","...","...","...","..."], "effects":["Reputacja +3",...], "penalties":["Cierpliwość -1",...]}`;
    const apiMessages = [
      { role: "system", content: systemPrompt }
    ];
    const aiResponse = await fetchOpenAIResponse(apiMessages);
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      const match = aiResponse.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = null;
        }
      }
    }
    if (parsed && parsed.question && parsed.options && parsed.effects && parsed.penalties) {
      setCurrentQuestion(parsed.question);
      setCurrentOptions(parsed.options);
      setCurrentEffect(validateEffectOrPenalty(parsed.effects[0] || "", true));
      setCurrentPenalty(validateEffectOrPenalty(parsed.penalties[0] || "", false));
    } else {
      setCurrentQuestion("Błąd AI lub niepoprawny format odpowiedzi.");
      setCurrentOptions([]);
      setCurrentEffect("");
      setCurrentPenalty("");
    }
    setIsLoadingAI(false);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      // Jeśli wyciszono podczas rozmowy, AI reaguje
      if (!prev && activeCall && conversationStep > 0 && conversationStep <= 5) {
        askAboutMuteOrCamera("mute");
      }
      return newMuted;
    });
  };

  const toggleCamera = () => {
    setIsCameraOn((prev) => {
      const newCamera = !prev;
      // Jeśli wyłączono kamerę podczas rozmowy, AI reaguje
      if (prev && activeCall && conversationStep > 0 && conversationStep <= 5) {
        askAboutMuteOrCamera("camera");
      }
      return newCamera;
    });
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const filteredCalls =
    filter === "all"
      ? callHistory
      : callHistory.filter((call) => call.type === filter);


  // Incoming call popup is now global (handled in AppLayout)

  // --- Incoming call popup (modal style) ---
  if (incomingCall) {
    // Try to get avatar for the caller (fallback to default icon)
    let avatarUrl = require("../assets/icons/user-avatar.png");
    const chat = contacts.find(c => c.id === incomingCall.id);
    if (chat && chat.avatar) {
      avatarUrl = chat.avatar;
    }
    return (
      <div className={styles.incomingCallModalOverlay}>
        <div className={styles.incomingCallModal}>
          <div className={styles.avatarContainer}>
            <img src={avatarUrl} alt="Avatar" className={styles.avatar} />
          </div>
          <div className={styles.callerName}>{incomingCall.name}</div>
          <div className={styles.callerSubtitle}>dzwoni do Ciebie...</div>
          <div className={styles.modalButtonRow}>
            <button className={styles.controlButton} onClick={() => onAcceptIncomingCall && onAcceptIncomingCall()}>
              Odbierz
            </button>
            <button className={styles.endCallButton} onClick={onRejectIncomingCall}>
              Odrzuć
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeCall) {
    return (
      <section className={styles.activeCallSection}>
        <h2>Rozmowa z {activeCall.name}</h2>
        <div className={styles.videoPlaceholder}>
          {isLoadingAI ? (
            <p>AI generuje pytanie...</p>
          ) : conversationStep > 0 && conversationStep <= 5 ? (
            <>
              <p>{currentQuestion}</p>
              <ul className={styles.scenarioOptions}>
                {currentOptions.map((option, idx) => (
                  <li key={idx} className={styles.scenarioOption}>
                    <button
                      onClick={() => handleSelectOption(option)}
                      className={styles.scenarioButton}
                      disabled={isLoadingAI}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
              <p className={styles.stepInfo}>Krok {conversationStep} / 5</p>
            </>
          ) : conversationStep > 5 ? (
            <div className={styles.evaluation}>
              <h3>To wszystko, o co chciałem zapytać.</h3>
              <p>Kontakt się rozłączył.</p>
              {conversationHistory.length > 0 && (
                <>
                  <p><strong>Efekt:</strong> {conversationHistory[conversationHistory.length-1].effect || "-"}</p>
                  <p><strong>Kara:</strong> {conversationHistory[conversationHistory.length-1].penalty || "-"}</p>
                </>
              )}
            </div>
          ) : (
            <p>Brak dostępnych scenariuszy.</p>
          )}
        </div>
        <div className={styles.callControls}>
          <button onClick={toggleMute} className={styles.controlButton}>
            {isMuted ? "Odcisz" : "Wycisz"}
          </button>
          <button onClick={toggleCamera} className={styles.controlButton}>
            {isCameraOn ? "Wyłącz kamerę" : "Włącz kamerę"}
          </button>
          <button onClick={handleEndCall} className={styles.endCallButton}>
            Zakończ rozmowę
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.callsSection}>
      <h1 className={styles.title}>Historia Rozmów</h1>
      <div className={styles.controls}>
        <label htmlFor="filter" className={styles.filterLabel}>
          Filtruj:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className={styles.filterSelect}
        >
          <option value="all">Wszystkie</option>
          <option value="outgoing">Wychodzące</option>
          <option value="incoming">Przychodzące</option>
          <option value="missed">Nieodebrane</option>
        </select>
      </div>
      <h2 className={styles.contactsTitle}>Kontakty</h2>
      <ul className={styles.contactsList}>
        {contacts.map((contact) => (
          <li key={contact.id} className={styles.contactItem}>
            <span className={styles.contactName}>{contact.name}</span>
            <button
              onClick={() => handleStartCall(contact)}
              className={styles.startCallButton}
            >
              Rozpocznij rozmowę
            </button>
          </li>
        ))}
      </ul>
      <h2 className={styles.historyTitle}>Historia Rozmów</h2>
      <ul className={styles.callList}>
        <li className={styles.callListHeader}>
          <span className={styles.callName}>Kontakt</span>
          <span className={styles.callTime}>Data</span>
          <span className={styles.callType}>Status</span>
          <span className={styles.callRating}>Ocena</span>
          <span className={styles.callActions}>Akcje</span>
        </li>
        {filteredCalls.map((call) => (
          <li key={call.id} className={`${styles.callItem} ${styles[call.type]}`}>
            <span className={styles.callName}>{call.name}</span>
            <span className={styles.callTime}>{formatTime(call.time)}</span>
            <span className={styles.callType}>
              {call.type === "outgoing"
                ? "Wychodzące"
                : call.type === "incoming"
                ? "Przychodzące"
                : "Nieodebrane"}
            </span>
            {call.rating && (
              <div className={styles.callRating}>
                <p>{call.rating.effect}</p>
                <p>{call.rating.penalty}</p>
              </div>
            )}
            <button
              onClick={() => handleDeleteCall(call.id)}
              className={styles.deleteButton}
            >
              <img src={deleteIcon} alt="Usuń" className={styles.deleteIcon} />
            </button>
          </li>
        ))}
      </ul>
      {filteredCalls.length === 0 && (
        <p className={styles.emptyState}>Brak rozmów do wyświetlenia.</p>
      )}
    </section>
  );
};

export default CallsSection;
