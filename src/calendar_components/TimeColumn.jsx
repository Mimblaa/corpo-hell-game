import React from "react";
import styles from "./CalendarApp.module.css";

const TimeColumn = () => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  return (
    <div className={styles.timeColumn}>
      {hours.map((hour) => (
        <div key={hour} className={styles.timeSlot}>
          {hour}
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;
