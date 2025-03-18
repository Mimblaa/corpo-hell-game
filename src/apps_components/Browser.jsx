import React, { useState } from "react";
import styles from "./AppsSection.module.css";

const Browser = () => {
  const [generalQuestion] = useState({
    question: "Jakie jest największe zwierzę na świecie?",
    answer: "Płetwal błękitny",
  });
  const [generalAnswer, setGeneralAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (generalAnswer.toLowerCase() === generalQuestion.answer.toLowerCase()) {
      setFeedback("Brawo! Poprawna odpowiedź.");
    } else {
      setFeedback("Niestety, spróbuj ponownie.");
    }
  };

  return (
    <>
      <h2>Pytanie z wiedzy ogólnej</h2>
      <p>{generalQuestion.question}</p>
      <input
        type="text"
        value={generalAnswer}
        onChange={(e) => setGeneralAnswer(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleSubmit} className={styles.submitButton}>
        Akceptuj
      </button>
      {feedback && <p className={styles.feedback}>{feedback}</p>}
    </>
  );
};

export default Browser;
