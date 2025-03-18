"use client";
import React, { useState } from "react";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import CalendarSection from "./calendar_components/CalendarSection";
import TaskSection from "./task_components/TaskSection";
import ChatSection from "./chat_components/ChatSection";
import AppsSection from "./apps_components/AppsSection";
import styles from "./AppLayout.module.css";

const AppLayout = () => {
  const [activeSection, setActiveSection] = useState("chat");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "chat":
        return <ChatSection />; // Use ChatSection
      case "calendar":
        return <CalendarSection searchQuery={searchQuery} />;
      case "tasks":
        return <TaskSection searchQuery={searchQuery} />;
      case "apps":
        return <AppsSection />;
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
          onSectionChange={handleSectionChange}
        />
        {renderContent()}
      </div>
    </main>
  );
};

export default AppLayout;
