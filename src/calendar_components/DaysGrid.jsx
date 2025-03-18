"use client";
import React from "react";
import styles from "./CalendarApp.module.css";
import DayColumn from "./DayColumn";

const DAYS = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek"];

const DaysGrid = ({ dates, events, onEditEvent }) => {
  return (
    <div className={styles.daysGrid}>
      {dates.map((date, index) => {
        const formattedDate = new Date(date);
        const filteredEvents = events.filter((event) => {
          const eventDate = new Date(event.startTime);
          return (
            eventDate.getFullYear() === formattedDate.getFullYear() &&
            eventDate.getMonth() === formattedDate.getMonth() &&
            eventDate.getDate() === formattedDate.getDate()
          );
        });

        return (
          <DayColumn
            key={formattedDate.getTime()} // Unikalny klucz
            date={formattedDate}
            number={formattedDate.getDate()}
            name={DAYS[index]}
            active={index === 0}
            events={filteredEvents}
            onEditEvent={onEditEvent} // Przekazujemy funkcję onEditEvent
          />
        );
      })}
    </div>
  );
};

export default DaysGrid;
