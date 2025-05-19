import React from "react";
import styles from "./TaskSection.module.css";
import TaskCard from "./TaskCard";

const TaskGroup = ({ date, day, tasks, onComplete, onTaskClick }) => {
  return (
    <article className={styles.taskGroup}>
      <header className={styles.taskGroupHeader}>
        <h2 className={styles.taskGroupDate}>{date}</h2>
        <span className={styles.taskGroupDay}>{day}</span>
      </header>
      {tasks.map((task, index) => (
        <TaskCard
          key={index}
          {...task}
          onComplete={() => onComplete(task.id)}
          onClick={() => onTaskClick && onTaskClick(task.id)}
        />
      ))}
    </article>
  );
};

export default TaskGroup;
