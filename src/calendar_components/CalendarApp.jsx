"use client";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./CalendarApp.module.css";
import TopBar from "./TopBar";
import SideNav from "./SideNav";
import MainContent from "./MainContent";
import { EventProvider } from "./EventContext";

const CalendarApp = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <EventProvider>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
        <main className={styles.appContainer}>
          <TopBar />
          <div className={styles.contentWrapper}>
            <SideNav />
            <MainContent />
          </div>
        </main>
      </EventProvider>
    </DndProvider>
  );
};

export default CalendarApp;
