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
    <>
      <h3>Zadania związane z Notatkami</h3>
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
      {selectedTask && (
        <div className={styles.taskDetails}>
          <h4>Wybrane zadanie:</h4>
          <p><strong>Tytuł:</strong> {selectedTask.title}</p>
          <p><strong>Kurs:</strong> {selectedTask.course}</p>
          <p><strong>Opis:</strong> {selectedTask.description}</p>
        </div>
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
