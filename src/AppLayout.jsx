"use client";
import React, { useState } from "react";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import ChatList from "./chat_components/ChatList";
import ChatContent from "./chat_components/ChatContent";
import CalendarSection from "./calendar_components/CalendarSection";
import TaskSection from "./task_components/TaskSection";
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
        return (
          <>
            <ChatList searchQuery={searchQuery} />
            <ChatContent />
          </>
        );
      case "calendar":
        return <CalendarSection searchQuery={searchQuery} />;

      case "tasks":
          return <TaskSection searchQuery={searchQuery} />;
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
