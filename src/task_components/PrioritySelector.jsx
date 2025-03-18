import React from "react";
import styles from "./TaskSection.module.css";

const priorities = [
  { id: "low", label: "Niski", color: "#4CAF50" },
  { id: "medium", label: "Średni", color: "#FF9800" },
  { id: "high", label: "Wysoki", color: "#f44336" },
];

const PrioritySelector = ({ value, onChange }) => {
  return (
    <div className={styles.prioritySelector}>
      {priorities.map((priority) => (
        <button
          key={priority.id}
          type="button"
          className={`${styles.priorityButton} ${
            value === priority.id ? styles.selected : ""
          }`}
          style={{ "--priority-color": priority.color }}
          onClick={() => onChange(priority.id)}
        >
          <span className={styles.priorityDot} />
          {priority.label}
        </button>
      ))}
    </div>
  );
};

export default PrioritySelector;
