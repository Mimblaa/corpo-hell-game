import React from "react";
import styles from "./CalendarApp.module.css";
import TimeColumn from "./TimeColumn";
import DaysGrid from "./DaysGrid";
import { useEvents } from "./EventContext";

const CalendarGrid = ({ currentDate, onEventClick, view }) => {
  const events = useEvents();

  const getDatesForView = () => {
    if (view === "Dzień") {
      return [currentDate]; // Use the exact currentDate for the "Dzień" view
    }

    const dayOfWeek = currentDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(currentDate);
    monday.setDate(monday.getDate() + mondayOffset);

    if (view === "Tydzień roboczy") {
      return Array.from({ length: 5 }, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return date;
      });
    } else if (view === "Tydzień") {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      });
    }
  };

  const dates = React.useMemo(() => getDatesForView(), [currentDate, view]);

  return (
    <div className={styles.calendarGrid}>
      <TimeColumn />
      <DaysGrid dates={dates} events={events} onEditEvent={onEventClick} />
    </div>
  );
};

export default CalendarGrid;
