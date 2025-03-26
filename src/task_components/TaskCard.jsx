import React, { useState } from "react";
import styles from "./TaskSection.module.css";

const TaskCard = ({
  title,
  dueDate,
  course,
  status,
  priority,
  tags,
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
