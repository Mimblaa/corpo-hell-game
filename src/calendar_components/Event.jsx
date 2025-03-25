"use client";
import React from "react";
import { useDrag } from "react-dnd";
import styles from "./CalendarApp.module.css";

export const Event = ({ event, onDoubleClick, overlapIndex, totalOverlaps }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "EVENT",
    item: { id: event.id, type: "EVENT" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const localStartTime = new Date(event.startTime.getTime() - event.startTime.getTimezoneOffset() * 60000);
  const minutesFromMidnight =
    localStartTime.getHours() * 60 +
    localStartTime.getMinutes();
  const durationMinutes =
    (event.endTime - event.startTime) / (1000 * 60);

  const widthPercentage = 100 / totalOverlaps;
  const leftOffsetPercentage = overlapIndex * widthPercentage;

  return (
    <div
      ref={drag}
      className={`${styles.calendarEvent} ${styles.dynamicEvent}`}
      style={{
        top: `${minutesFromMidnight}px`,
        height: `${durationMinutes}px`,
        width: `calc(${widthPercentage}% - 2px)`,
        left: `calc(${leftOffsetPercentage}% + 1px)`,
        backgroundColor: event.color || "#5b5fc7",
        opacity: isDragging ? 0.5 : 1,
      }}
      onDoubleClick={onDoubleClick}
    >
      <h3 className={styles.eventTitle}>{event.title}</h3>
      <p className={styles.eventTime}>
        {new Date(event.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
};
