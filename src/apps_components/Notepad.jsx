import React, { useState } from "react";
import styles from "./AppsSection.module.css";

const Notepad = ({ tasks, setTasks }) => {
  const [transcriptionTask] = useState(
    "Przepisz ten tekst dokładnie: 'Witaj w Notatniku!'"
  );
  const [userText, setUserText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTranscription, setShowTranscription] = useState(false);

  const handleTaskSelect = (e) => {
    const taskId = parseInt(e.target.value, 10); // Ensure taskId is a number
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTask(task);
    if (taskId) {
      setShowTranscription(true);
      setUserText("");
      setFeedback("");
    }
  };

  const handleCloseTranscription = () => {
    setShowTranscription(false);
    setSelectedTask(null);
  };

  const handleSubmit = () => {
    const expectedText = transcriptionTask.split(": ")[1].replace(/'/g, "").trim();
    if (selectedTask && userText.trim() === expectedText) {
      setFeedback("Brawo! Poprawnie przepisałeś tekst.");
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask.id ? { ...task, status: "Ukończone" } : task
        )
      );
    } else {
      setFeedback("Niestety, spróbuj ponownie.");
    }
  };

  return (
    <div className={styles.notepadContainer}>
      <div className={styles.scrollableContent}>
        <h3 className={styles.notepadSubtitle}>Zadania związane z Notatkami</h3>
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
        {selectedTask && (
          <div className={`${styles.taskDetails} ${styles.enhancedTaskDetails}`}>
            <h4 className={styles.taskTitle}>Wybrane zadanie:</h4>
            <p><strong>Tytuł:</strong> {selectedTask.title}</p>
            <p><strong>Kurs:</strong> {selectedTask.course}</p>
            <p><strong>Opis:</strong> {selectedTask.description}</p>
          </div>
        )}
        {showTranscription && (
          <div className={`${styles.transcriptionTask} ${styles.enhancedQuestion}`}>
            <h2 className={styles.questionTitle}>Zadanie Notatnika</h2>
            <p className={styles.questionText}>{transcriptionTask}</p>
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              className={styles.textarea}
            />
            <button onClick={handleSubmit} className={`${styles.submitButton} ${styles.enhancedButton}`}>
              Akceptuj
            </button>
            {feedback && <p className={`${styles.feedback} ${styles.enhancedFeedback}`}>{feedback}</p>}
            <button onClick={handleCloseTranscription} className={`${styles.closeButton} ${styles.enhancedButton}`}>
              Zamknij
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notepad;
