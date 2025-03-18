"use client";
import React from "react";
import { useDrag } from "react-dnd";
import styles from "./CalendarApp.module.css";

export const Event = ({ event, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "EVENT",
    item: { id: event.id, type: "EVENT" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const minutesFromMidnight =
    event.startTime.getHours() * 60 + event.startTime.getMinutes();
  const durationMinutes =
    (event.endTime - event.startTime) / (1000 * 60); // Przeliczenie z ms na minuty

  return (
    <div
      ref={drag}
      className={styles.calendarEvent}
      style={{
        top: `${minutesFromMidnight}px`, // Ustawienie na odpowiedniej godzinie
        height: `${durationMinutes}px`, // Ustawienie odpowiedniej wysokości
        backgroundColor: event.color || "#5b5fc7",
        opacity: isDragging ? 0.5 : 1,
      }}
      onDoubleClick={() => onClick(event)}
    >
      <h3 className={styles.eventTitle}>{event.title}</h3>
      <p className={styles.eventTime}>
        {event.startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
};
