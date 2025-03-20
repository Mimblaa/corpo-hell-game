import React, { useState } from "react";
import styles from "./AppsSection.module.css";

const Notepad = ({ tasks }) => {
  const [transcriptionTask] = useState(
    "Przepisz ten tekst dokładnie: 'Witaj w Notatniku!'"
  );
  const [userText, setUserText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTranscription, setShowTranscription] = useState(false);

  const handleTaskSelect = (e) => {
    const taskId = e.target.value;
    if (taskId) {
      setSelectedTask(tasks.find((task) => task.id === taskId));
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
    if (userText === transcriptionTask.split(": ")[1].replace(/'/g, "")) {
      setFeedback("Brawo! Poprawnie przepisałeś tekst.");
    } else {
      setFeedback("Niestety, spróbuj ponownie.");
    }
  };

  return (
    <>
      <h3>Zadania związane z Notatkami</h3>
      {!showTranscription && (
        <select
          className={styles.select}
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
      )}
      {showTranscription && (
        <>
          <h2>Zadanie Notatnika</h2>
          <p>{transcriptionTask}</p>
          <textarea
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            className={styles.textarea}
          />
          <button onClick={handleSubmit} className={styles.submitButton}>
            Akceptuj
          </button>
          {feedback && <p className={styles.feedback}>{feedback}</p>}
          <button
            onClick={handleCloseTranscription}
            className={styles.closeButton}
          >
            Zamknij
          </button>
        </>
      )}
    </>
  );
};

export default Notepad;
