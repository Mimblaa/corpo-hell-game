"use client";
import React from "react";
import styles from "./CalendarApp.module.css";
import DayColumn from "./DayColumn";

const DAYS = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek"];

const DaysGrid = ({ dates, events, onEditEvent }) => {
  const today = new Date();

  return (
    <div className={styles.daysGrid}>
      {dates.map((date, index) => {
        const formattedDate = new Date(date);
        const isToday =
          today.getFullYear() === formattedDate.getFullYear() &&
          today.getMonth() === formattedDate.getMonth() &&
          today.getDate() === formattedDate.getDate();

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
            className={isToday ? styles.currentDay : ""} // Add currentDay class
            events={filteredEvents}
            onEditEvent={onEditEvent} // Przekazujemy funkcję onEditEvent
          />
        );
      })}
    </div>
  );
};

export default DaysGrid;
