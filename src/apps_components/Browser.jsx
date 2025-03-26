import React, { useState } from "react";
import styles from "./AppsSection.module.css";
import { addNotification } from "../notification_components/NotificationSection";

const Browser = ({ tasks, setTasks }) => {
  const [generalQuestion] = useState({
    question: "Jakie jest największe zwierzę na świecie?",
    options: ["A. Słoń afrykański", "B. Płetwal błękitny", "C. Rekin wielorybi"],
    answer: "B",
  });
  const [generalAnswer, setGeneralAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskSelect = (e) => {
    const taskId = parseInt(e.target.value, 10);
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTask(task);
    setFeedback("");
    setGeneralAnswer("");
  };

  const handleTaskCompletion = (task) => {
    addNotification(`Zadanie "${task.title}" zostało ukończone.`);
  };
  

  const handleSubmit = () => {
    if (selectedTask && generalAnswer === generalQuestion.answer) {
      setFeedback("Brawo! Poprawna odpowiedź.");
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === selectedTask.id) {
        handleTaskCompletion(task);
        return { ...task, status: "Ukończone" };
          }
          return task;
        })
      );
    } else {
      setFeedback("Niestety, spróbuj ponownie.");
    }
  };

  const handleCloseQuestion = () => {
    setSelectedTask(null);
    setFeedback("");
    setGeneralAnswer("");
  };

  return (
    <div className={styles.browserContainer}>
      <div className={styles.scrollableContent}>
        <h2 className={styles.browserTitle}>Przeglądarka</h2>
        <h3 className={styles.browserSubtitle}>Zadania związane z Internetem</h3>

        {/* Task Selection */}
        <select
          className={`${styles.select} ${styles.enhancedSelect}`}
          onChange={handleTaskSelect}
          value={selectedTask?.id || ""}
        >
          <option value="">Wybierz zadanie</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title} - {task.course}
            </option>
          ))}
        </select>

        {/* Task Details */}
        {selectedTask && (
          <div className={`${styles.taskDetails} ${styles.enhancedTaskDetails}`}>
            <h4 className={styles.taskTitle}>Wybrane zadanie:</h4>
            <p>
              <strong>Tytuł:</strong> {selectedTask.title}
            </p>
            <p>
              <strong>Opis:</strong> {selectedTask.description}
            </p>
          </div>
        )}

        {/* General Knowledge Question */}
        {selectedTask && (
          <div className={`${styles.generalQuestion} ${styles.enhancedQuestion}`}>
            <h2 className={styles.questionTitle}>Pytanie z wiedzy ogólnej</h2>
            <p className={styles.questionText}>{generalQuestion.question}</p>
            <div className={styles.optionsContainer}>
              {generalQuestion.options.map((option, index) => (
                <label key={index} className={`${styles.optionLabel} ${styles.enhancedOptionLabel}`}>
                  <input
                    type="radio"
                    name="generalQuestion"
                    value={option[0]}
                    onChange={(e) => setGeneralAnswer(e.target.value)}
                    className={styles.radioInput}
                  />
                  {option}
                </label>
              ))}
            </div>
            <button onClick={handleSubmit} className={`${styles.submitButton} ${styles.enhancedButton}`}>
              Akceptuj
            </button>
            {feedback && <p className={`${styles.feedback} ${styles.enhancedFeedback}`}>{feedback}</p>}
            <button onClick={handleCloseQuestion} className={`${styles.closeButton} ${styles.enhancedButton}`}>
              Zamknij pytanie
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browser;
