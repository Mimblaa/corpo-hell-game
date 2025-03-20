import React, { useState } from "react";
import styles from "./AppsSection.module.css";

const Email = ({ tasks, setTasks }) => {
  const [emailTask] = useState({
    recipient: "Jan Kowalski",
    message: "Cześć, jak się masz?",
  });
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [showTask, setShowTask] = useState(false);

  const handleSubmit = () => {
    if (selectedTask && recipient === emailTask.recipient && message === emailTask.message) {
      setFeedback("Brawo! Mail został poprawnie wysłany.");
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === parseInt(selectedTask) ? { ...task, status: "Ukończone" } : task
        )
      );
    } else {
      setFeedback("Niestety, spróbuj ponownie.");
    }
  };

  const handleTaskSelection = (e) => {
    setSelectedTask(e.target.value);
    setShowTask(!!e.target.value);
    setFeedback(""); // Reset feedback when switching tasks
  };

  const handleCloseFeedback = () => {
    setShowTask(false);
    setSelectedTask("");
    setRecipient("");
    setMessage("");
    setFeedback("");
  };

  return (
    <>
      <h2>Poczta</h2>
      <p>Wyślij wiadomość e-mail.</p>
      <h3>Zadania związane z Pocztą</h3>
      <select
        className={styles.select}
        value={selectedTask}
        onChange={handleTaskSelection}
      >
        <option value="">Wybierz zadanie</option>
        {tasks.map((task) => (
          <option key={task.id} value={task.id}>
            {task.title} - {task.course}
          </option>
        ))}
      </select>
      {showTask && (
        <>
          <h2>Zadanie Poczty</h2>
          <p>Odbiorca: {emailTask.recipient}</p>
          <p>Treść: {emailTask.message}</p>
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
          <button onClick={handleSubmit} className={styles.submitButton}>
            Akceptuj
          </button>
          {feedback && (
            <>
              <p className={styles.feedback}>{feedback}</p>
              <button onClick={handleCloseFeedback} className={styles.closeButton}>
                Zamknij
              </button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Email;
