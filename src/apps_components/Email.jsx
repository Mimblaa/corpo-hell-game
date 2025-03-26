import React, { useState } from "react";
import styles from "./AppsSection.module.css";
import { addNotification } from "../notification_components/NotificationSection"; // Import notification function

const Email = ({ tasks, setTasks }) => {
  const [emailTask] = useState({
    recipient: "Jan Kowalski",
    message: "Cześć, jak się masz?",
  });
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTask, setShowTask] = useState(false);

  const handleTaskCompletion = (task) => {
    addNotification(`Zadanie "${task.title}" zostało ukończone.`);
  };

  const handleSubmit = () => {
    if (
      selectedTask &&
      recipient === emailTask.recipient &&
      message === emailTask.message
    ) {
      setFeedback("Brawo! Mail został poprawnie wysłany.");
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

  const handleTaskSelection = (e) => {
    const taskId = parseInt(e.target.value, 10); // Ensure taskId is a number
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTask(task);
    setShowTask(!!task);
    setFeedback(""); // Reset feedback when switching tasks
    setRecipient("");
    setMessage("");
  };

  const handleCloseFeedback = () => {
    setShowTask(false);
    setSelectedTask(null);
    setRecipient("");
    setMessage("");
    setFeedback("");
  };

  return (
    <div className={styles.emailContainer}>
      <div className={styles.scrollableContent}>
        <h2 className={styles.emailTitle}>Poczta</h2>
        <h3 className={styles.emailSubtitle}>Zadania związane z Korespondencją</h3>
        <select
          className={`${styles.select} ${styles.enhancedSelect}`}
          onChange={handleTaskSelection}
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
        {showTask && (
          <div className={`${styles.emailTask} ${styles.enhancedQuestion}`}>
            <h2 className={styles.questionTitle}>Zadanie Poczty</h2>
            <p><strong>Odbiorca:</strong> {emailTask.recipient}</p>
            <p><strong>Treść:</strong> {emailTask.message}</p>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={styles.select}
            >
              <option value="">Wybierz odbiorcę</option>
              <option value="Jan Kowalski">Jan Kowalski</option>
              <option value="Anna Nowak">Anna Nowak</option>
              <option value="Piotr Wiśniewski">Piotr Wiśniewski</option>
            </select>
            <textarea
              placeholder="Wpisz treść wiadomości"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.textarea}
            />
            <button onClick={handleSubmit} className={`${styles.submitButton} ${styles.enhancedButton}`}>
              Wyślij
            </button>
            {feedback && <p className={`${styles.feedback} ${styles.enhancedFeedback}`}>{feedback}</p>}
            <button onClick={handleCloseFeedback} className={`${styles.closeButton} ${styles.enhancedButton}`}>
              Zamknij zadanie
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Email;
