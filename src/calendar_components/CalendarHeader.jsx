"use client";
import React from "react";
import styles from "./CalendarApp.module.css";

// Importowanie lokalnych plików PNG
import calendarIcon from "../assets/icons/calendar-icon.png";
import newMeetingIcon from "../assets/icons/new-meeting.png";

const CalendarHeader = ({ onNewEvent }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerIcon}>
        <img src={calendarIcon} alt="Kalendarz" width="17" height="17" style={{ filter: "invert(1)" }} />
      </div>
      <h1 className={styles.headerTitle}>Kalendarz</h1>
      <div className={styles.headerActions}>
        <div className={styles.newMeetingContainer}>
          <button className={styles.newMeetingButton} onClick={onNewEvent}>
            <img src={newMeetingIcon} alt="Nowe spotkanie" width="17" height="17" />
            <span>Nowe spotkanie</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;
