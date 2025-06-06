import React, { useState } from "react";
import styles from "./TaskSection.module.css";

const TaskCard = ({
  title,
  dueDate,
  course,
  status,
  priority,
  tags,
  effect,
  penalty,
  isNew,
  onClick,
}) => {
  return (
    <>
      <div
        className={`${styles.taskCard} ${styles[`priority${priority}`]}`}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : undefined }}
      >
        <div className={styles.taskContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 className={styles.taskTitle}>{title}</h3>
            {isNew && <span className={styles.newBadge}>Nowe</span>}
          </div>
          <p className={styles.taskTime}>
            Termin: {new Date(dueDate).toLocaleString("pl-PL")}
          </p>
          <p className={styles.taskCourse}>{course}</p>
          {tags && tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className={styles.taskEffects}>
            <p className={styles.effect}>
              <strong>Efekt:</strong> {effect && effect.attribute ? effect.attribute : "-"} {effect && effect.value ? (effect.value > 0 ? `+${effect.value}` : effect.value) : ""}
            </p>
            <p className={styles.penalty}>
              <strong>Kara:</strong> {penalty && penalty.attribute ? penalty.attribute : "-"} {penalty && penalty.value ? (penalty.value > 0 ? `+${penalty.value}` : penalty.value) : ""}
            </p>
          </div>
        </div>
        <span
          className={`${styles.taskStatus} ${
            styles[status.toLowerCase().replace(/\s+/g, "")]
          }`}
        >
          {status}
        </span>
      </div>
    </>
  );
};

export default TaskCard;
