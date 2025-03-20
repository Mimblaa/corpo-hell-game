import React, { useState } from "react";
import styles from "./AppsSection.module.css";

const Notepad = ({ tasks }) => {
  const [transcriptionTask] = useState(
    "Przepisz ten tekst dokładnie: 'Witaj w Notatniku!'"
  );
  const [userText, setUserText] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (userText === transcriptionTask.split(": ")[1].replace(/'/g, "")) {
      setFeedback("Brawo! Poprawnie przepisałeś tekst.");
    } else {
      setFeedback("Niestety, spróbuj ponownie.");
    }
  };

  return (
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
      <h3>Zadania związane z Notatkami</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.course}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Notepad;
