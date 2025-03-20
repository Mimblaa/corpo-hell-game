import React, { useState } from "react";
import styles from "./AppsSection.module.css";

const Email = ({ tasks }) => {
  const [emailTask] = useState({
    recipient: "Jan Kowalski",
    message: "Cześć, jak się masz?",
  });
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (recipient === emailTask.recipient && message === emailTask.message) {
      setFeedback("Brawo! Mail został poprawnie wysłany.");
    } else {
      setFeedback("Niestety, spróbuj ponownie.");
    }
  };

  return (
    <>
      <h2>Poczta</h2>
      <p>Wyślij wiadomość e-mail.</p>
      <h3>Zadania związane z Pocztą</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.course}
          </li>
        ))}
      </ul>
      <h2>Zadanie Poczty</h2>
      <p>Odbiorca: {emailTask.recipient}</p>
      <p>Treść: {emailTask.message}</p>
      <input
        type="text"
        placeholder="Wpisz odbiorcę"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className={styles.input}
      />
      <textarea
        placeholder="Wpisz treść wiadomości"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={styles.textarea}
      />
      <button onClick={handleSubmit} className={styles.submitButton}>
        Akceptuj
      </button>
      {feedback && <p className={styles.feedback}>{feedback}</p>}
    </>
  );
};

export default Email;
