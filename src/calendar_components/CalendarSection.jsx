"use client";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { EventProvider } from "./EventContext";
import MainContent from "./MainContent";
import styles from "./CalendarApp.module.css";

const CalendarSection = ({ searchQuery }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <EventProvider>
        <section className={styles.calendarSection}>
          <MainContent />
        </section>
      </EventProvider>
    </DndProvider>
  );
};

export default CalendarSection;
