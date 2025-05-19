import React from "react";
import styles from "./TaskSection.module.css";
import TaskGroup from "./TaskGroup";

const TaskList = ({ tasks, filter, onComplete, onTaskClick }) => {
  const filteredTasks = filter ? tasks.filter(filter) : tasks;
  const taskGroups = filteredTasks.reduce((acc, task) => {
    const date = task.dueDate.split("T")[0];
    if (!acc[date]) {
      acc[date] = {
        date,
        day: new Date(date).toLocaleDateString("pl-PL", { weekday: "long" }),
        tasks: [],
      };
    }
    acc[date].tasks.push(task);
    return acc;
  }, {});

  const groupedTasks = Object.values(taskGroups).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  if (filteredTasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyStateText}>Brak zadań do wyświetlenia.</p>
      </div>
    );
  }

  return (
    <div className={styles.tasksContainer}>
      <div className={styles.taskGroups}>
        {groupedTasks.map((group, index) => (
          <TaskGroup
            key={`${group.date}-${index}`}
            date={group.date}
            day={group.day}
            tasks={group.tasks}
            onComplete={onComplete}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
