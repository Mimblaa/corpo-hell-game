"use client";
import React, { useState, useEffect } from "react";
import styles from "./CallsSection.module.css";
import deleteIcon from "../assets/icons/delete.png"; // Import the delete icon

const CallsSection = ({ defaultContacts }) => {
  const [callHistory, setCallHistory] = useState(() => {
    const savedHistory = localStorage.getItem("callHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [filter, setFilter] = useState(() => {
    return localStorage.getItem("callFilter") || "all";
  });

  const [contacts, setContacts] = useState(() => {
    const savedContacts = localStorage.getItem("contacts");
    const savedChats = localStorage.getItem("chats");
    const chatContacts = savedChats ? JSON.parse(savedChats).map(chat => ({ id: `chat-${chat.id}`, name: chat.name })) : [];
    return savedContacts ? [...JSON.parse(savedContacts), ...chatContacts] : [...defaultContacts, ...chatContacts];
  });

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts.filter(contact => !contact.id.toString().startsWith("chat-"))));
  }, [contacts]);

  const [activeCall, setActiveCall] = useState(null);
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

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDeleteCall = (id) => {
    setCallHistory((prevHistory) => prevHistory.filter((call) => call.id !== id));
  };

  const handleStartCall = (contact) => {
    setActiveCall({ ...contact, time: new Date().toISOString(), type: "outgoing" });
    setSelectedScenarioOption(null); // Reset the Video Stream Placeholder
  };

  const handleEndCall = () => {
    if (activeCall) {
      setCallHistory((prevHistory) => [
        ...prevHistory,
        {
          ...activeCall,
          id: Date.now(), // Unikalne ID rozmowy
          scenario: selectedScenarioOption || { text: "Brak scenariusza" },
          rating: selectedScenarioOption
            ? { effect: selectedScenarioOption.effect, penalty: selectedScenarioOption.penalty }
            : { effect: "Brak oceny", penalty: "Brak kary" }, // Save both effect and penalty
        },
      ]);
    }
    setActiveCall(null);
    setIsMuted(false);
    setIsCameraOn(true);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
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

  if (activeCall) {
    const scenario = scenarios.length > 0 ? scenarios[0] : null;
    return (
      <section className={styles.activeCallSection}>
        <h2>Rozmowa z {activeCall.name}</h2>
        <div className={styles.videoPlaceholder}>
          {selectedScenarioOption ? (
            <div className={styles.evaluation}>
              <h3>Ocena Twojej Decyzji</h3>
              <p><strong>Efekt:</strong> {selectedScenarioOption.effect}</p>
              <p><strong>Kara:</strong> {selectedScenarioOption.penalty}</p>
            </div>
          ) : scenario ? (
            <>
              <p>{scenario.question}</p>
              <ul className={styles.scenarioOptions}>
                {scenario.options.map((option) => (
                  <li key={option.id} className={styles.scenarioOption}>
                    <button
                      onClick={() => setSelectedScenarioOption(option)}
                      className={styles.scenarioButton}
                    >
                      {option.text}
                    </button>
                  </li>
                ))}
              </ul>
            </>
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
