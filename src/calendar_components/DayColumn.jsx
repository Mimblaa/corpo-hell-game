import React from "react";
import { useDrop } from "react-dnd";
import { useEvents, useEventDispatch } from "./EventContext";
import { Event } from "./Event";
import styles from "./CalendarApp.module.css";

const DayColumn = ({ number, name, active, date, onEditEvent, className }) => {
  const columnClass = `${active ? styles.dayColumnactive : styles.dayColumn} ${className}`;
  const events = useEvents();
  const dispatch = useEventDispatch();

  const [{ isOver }, drop] = useDrop({
    accept: "EVENT",
    drop: (item, monitor) => {
      const dropOffset = monitor.getClientOffset();
      const columnRect = document
        .getElementById(`day-${date}`)
        .getBoundingClientRect();
      const hourHeight = 50; // height per hour in pixels
      const droppedHour = Math.floor(
        (dropOffset.y - columnRect.top) / hourHeight
      );

      const newStartTime = new Date(date);
      newStartTime.setHours(droppedHour);

      dispatch({
        type: "MOVE_EVENT",
        id: item.id,
        startTime: newStartTime,
        endTime: new Date(newStartTime.getTime() + 60 * 60 * 1000), // 1 hour duration
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const dayEvents = events.filter(
    (event) => event.startTime.toDateString() === date.toDateString()
  );

  return (
    <div
      id={`day-${date}`}
      className={`${columnClass} ${isOver ? styles.dropTarget : ""}`}
      ref={drop}
    >
      <div className={styles.dayHeader}>
        <div className={styles.dayNumber}>{number}</div>
        <div className={styles.dayName}>{name}</div>
      </div>
      <div className={styles.eventsContainer}>
        {dayEvents.map((event) => (
          <Event
            key={event.id}
            event={event}
            onDoubleClick={() => onEditEvent(event)} // Open EventModal on double-click
          />
        ))}
      </div>
    </div>
  );
};

export default DayColumn;
