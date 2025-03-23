"use client";
import React from "react";
import styles from "./CalendarApp.module.css";
import DayColumn from "./DayColumn";

const DAYS = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];

const DaysGrid = ({ dates, events, onEditEvent }) => {
  const today = new Date();

  return (
    <div className={styles.daysGrid}>
      {dates.map((date) => {
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
            key={formattedDate.getTime()} // Unique key
            date={formattedDate}
            number={formattedDate.getDate()}
            name={DAYS[formattedDate.getDay()]} // Dynamically calculate the day name
            className={isToday ? styles.currentDay : ""} // Add currentDay class
            events={filteredEvents}
            onEditEvent={onEditEvent} // Pass onEditEvent function
          />
        );
      })}
    </div>
  );
};

export default DaysGrid;
