import React from "react";
import styles from "./CalendarApp.module.css";
import TimeColumn from "./TimeColumn";
import DaysGrid from "./DaysGrid";
import { useEvents } from "./EventContext";

const CalendarGrid = ({ currentDate, onEventClick }) => {
  const events = useEvents();

  // Get current week dates based on currentDate prop
  const getCurrentWeekDates = () => {
    const dayOfWeek = currentDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(currentDate);
    monday.setDate(monday.getDate() + mondayOffset);

    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  const weekDates = React.useMemo(() => getCurrentWeekDates(), [currentDate]);

  return (
    <div className={styles.calendarGrid}>
      <TimeColumn />
      <DaysGrid dates={weekDates} events={events} onEditEvent={onEventClick} />
    </div>
  );
};

export default CalendarGrid;
