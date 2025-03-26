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
}) => {

  return (
    <>
      <div
        className={`${styles.taskCard} ${styles[`priority${priority}`]}`}
      >
        <div className={styles.taskContent}>
          <h3 className={styles.taskTitle}>{title}</h3>
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
              <strong>Efekt:</strong> {effect.attribute} {effect.value > 0 ? `+${effect.value}` : effect.value}
            </p>
            <p className={styles.penalty}>
              <strong>Kara:</strong> {penalty.attribute} {penalty.value > 0 ? `+${penalty.value}` : penalty.value}
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
