import React from "react";
import { useDrop } from "react-dnd";
import { useEvents, useEventDispatch } from "./EventContext";
import { Event } from "./Event";
import styles from "./CalendarApp.module.css";

const DayColumn = ({ number, name, active, date, onEditEvent, className }) => {
  const columnClass = `${active ? styles.dayColumnactive : styles.dayColumn} ${className}`;
  const events = useEvents();
  const dispatch = useEventDispatch();

  const dayEvents = events.filter(
    (event) =>
      new Date(event.startTime.getTime() - event.startTime.getTimezoneOffset() * 60000).toDateString() ===
      date.toDateString()
  );

  const calculateOverlaps = (events) => {
    const overlaps = [];
    events.forEach((event) => {
      let overlapGroup = overlaps.find((group) =>
        group.some(
          (e) =>
            event.startTime < e.endTime && event.endTime > e.startTime // Check for overlap
        )
      );
      if (!overlapGroup) {
        overlapGroup = [];
        overlaps.push(overlapGroup);
      }
      overlapGroup.push(event);
    });
    return overlaps;
  };

  const overlaps = calculateOverlaps(dayEvents);

  const [{ isOver }, drop] = useDrop({
    accept: "EVENT",
    drop: (item, monitor) => {
      const dropOffset = monitor.getClientOffset();
      const columnRect = document
        .getElementById(`day-${date}`)
        .getBoundingClientRect();
      const hourHeight = 50; // height per hour in pixels
      const droppedHour = Math.floor((dropOffset.y - columnRect.top) / hourHeight);

      const newStartTime = new Date(date);
      newStartTime.setHours(droppedHour);
      newStartTime.setMinutes(0); // Reset minutes to 0 for consistency

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
      <div className={styles.eventsContainer} style={{ position: "relative", overflow: "hidden" }}>
        {overlaps.flatMap((group, groupIndex) =>
          group.map((event, eventIndex) => (
            <Event
              key={event.id}
              event={event}
              onDoubleClick={() => onEditEvent(event)}
              overlapIndex={eventIndex}
              totalOverlaps={group.length}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DayColumn;
