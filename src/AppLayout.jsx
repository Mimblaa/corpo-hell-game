"use client";
import React, { useState, useEffect } from "react";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import CalendarSection from "./calendar_components/CalendarSection";
import TaskSection from "./task_components/TaskSection";
import GlobalAiTaskGenerator from "./task_components/GlobalAiTaskGenerator";
import GlobalAiChatGenerator from "./chat_components/GlobalAiChatGenerator";
import ChatSection from "./chat_components/ChatSection";
import AppsSection from "./apps_components/AppsSection";
import OneDriveSection from "./onedrive_components/OneDriveSection";
import CallsSection from "./calls_components/CallsSection";
import NotificationSection from "./notification_components/NotificationSection";
import styles from "./styles/AppLayout.module.css";
import callsStyles from "./calls_components/CallsSection.module.css";

const AppLayout = ({
  incomingCall,
  onAcceptIncomingCall,
  onRejectIncomingCall,
  setActiveCall,
  activeCall
}) => {
  const [activeSection, setActiveSection] = useState(() => {
    const storedSection = localStorage.getItem("activeSection");
    return storedSection || "chat";
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    // Load search query from localStorage or default to an empty string
    return localStorage.getItem("searchQuery") || "";
  });

  useEffect(() => {
    // Save active section and search query to localStorage whenever they change
    localStorage.setItem("activeSection", activeSection);
    localStorage.setItem("searchQuery", searchQuery);
  }, [activeSection, searchQuery]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === "notification") {
      localStorage.setItem("notificationVisited", "true");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "chat":
        return <ChatSection onChangeSection={handleSectionChange} />;
      case "calendar":
        return <CalendarSection searchQuery={searchQuery} />;
      case "tasks":
        return <TaskSection searchQuery={searchQuery} />;
      case "apps":
        return <AppsSection />;
      case "onedrive":
        return <OneDriveSection />;
      case "calls":
        return <CallsSection
          incomingCall={incomingCall}
          onAcceptIncomingCall={onAcceptIncomingCall}
          onRejectIncomingCall={onRejectIncomingCall}
          setActiveCall={setActiveCall}
          activeCall={activeCall}
        />;
      case "notification":
        return <NotificationSection />;
      default:
        return null;
    }
  };

  // Ustal poziom trudności globalnie (możesz pobierać z ustawień gracza)
  const difficulty = "hard";
  // Handler for accepting incoming call: set section to 'calls' and start call
  const handleAcceptAndSwitchToCall = () => {
    if (onAcceptIncomingCall) {
      onAcceptIncomingCall((contact) => {
        if (setActiveCall) setActiveCall(contact);
        setActiveSection("calls");
      });
    }
  };

  return (
    <main className={styles.layout}>
      {/* Generator AI tasków i AI wiadomości działa globalnie */}
      <GlobalAiTaskGenerator difficulty={difficulty} />
      <GlobalAiChatGenerator difficulty={difficulty} />
      <AppHeader onSearch={handleSearch} />
      {/* Global incoming call popup (styled like CallsSection) */}
      {incomingCall && (() => {
        // Try to get avatar for the caller (fallback to default icon)
        let avatarUrl = require("./assets/icons/user-avatar.png");
        let contacts = [];
        try {
          const savedChats = localStorage.getItem("chats");
          if (savedChats) {
            contacts = JSON.parse(savedChats).map(chat => ({ id: chat.id, name: chat.name, avatar: chat.avatar }));
          }
        } catch {}
        const chat = contacts.find(c => c.id === incomingCall.id);
        if (chat && chat.avatar) {
          avatarUrl = chat.avatar;
        }
        return (
          <div className={callsStyles.incomingCallModalOverlay}>
            <div className={callsStyles.incomingCallModal}>
              <div className={callsStyles.avatarContainer}>
                <img src={avatarUrl} alt="Avatar" className={callsStyles.avatar} />
              </div>
              <div className={callsStyles.callerName}>{incomingCall.name}</div>
              <div className={callsStyles.callerSubtitle}>dzwoni do Ciebie...</div>
              <div className={callsStyles.modalButtonRow}>
                <button className={callsStyles.controlButton} onClick={handleAcceptAndSwitchToCall}>
                  Odbierz
                </button>
                <button className={callsStyles.endCallButton} onClick={onRejectIncomingCall}>
                  Odrzuć
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      <div className={styles.contentWrapper}>
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        {renderContent()}
      </div>
    </main>
  );
};

export default AppLayout;
