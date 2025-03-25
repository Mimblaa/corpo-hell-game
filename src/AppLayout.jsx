"use client";
import React, { useState, useEffect } from "react";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import CalendarSection from "./calendar_components/CalendarSection";
import TaskSection from "./task_components/TaskSection";
import ChatSection from "./chat_components/ChatSection";
import AppsSection from "./apps_components/AppsSection";
import OneDriveSection from "./onedrive_components/OneDriveSection";
import CallsSection from "./calls_components/CallsSection";
import NotificationSection from "./notification_components/NotificationSection";
import styles from "./AppLayout.module.css";

const AppLayout = () => {
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
        return <CallsSection />;
      case "notification":
        return <NotificationSection />;
      default:
        return null;
    }
  };

  return (
    <main className={styles.layout}>
      <AppHeader onSearch={handleSearch} />
      <div className={styles.contentWrapper}>
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange} // Pass updated handler
        />
        {renderContent()}
      </div>
    </main>
  );
};

export default AppLayout;
