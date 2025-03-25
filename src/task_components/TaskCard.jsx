import React, { useState } from "react";
import styles from "./TaskSection.module.css";
import { addNotification } from "../notification_components/NotificationSection";

const TaskCard = ({
  title,
  dueDate,
  course,
  status,
  priority,
  tags,
  onComplete,
}) => {
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [mathAnswer, setMathAnswer] = useState("");
  const [mathProblem, setMathProblem] = useState({ a: 0, b: 0 });

  const handleDoubleClick = () => {
    if (status !== "Ukończone") {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      setMathProblem({ a, b });
      setIsGameOpen(true);
    }
  };

  const handleGameSubmit = () => {
    if (parseInt(mathAnswer, 10) === mathProblem.a + mathProblem.b) {
      onComplete();
      addNotification("Zadanie zostało ukończone.");
    }
    setIsGameOpen(false);
    setMathAnswer("");
  };

  return (
    <>
      <div
        className={`${styles.taskCard} ${styles[`priority${priority}`]}`}
        onDoubleClick={handleDoubleClick}
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
      {isGameOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <header className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Rozwiąż zadanie matematyczne</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsGameOpen(false)}
              >
                ×
              </button>
            </header>
            <div className={styles.form}>
              <p>
                Oblicz: {mathProblem.a} + {mathProblem.b}
              </p>
              <input
                type="number"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                className={styles.input}
              />
              <button
                onClick={handleGameSubmit}
                className={styles.submitButton}
              >
                Sprawdź
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
