import React, { useState } from "react";
import styles from "./AppsSection.module.css";

const Calculator = () => {
  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { question: `${num1} + ${num2} = ?`, answer: num1 + num2 };
  };

  const [mathProblem, setMathProblem] = useState(generateMathProblem());
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (parseInt(userAnswer, 10) === mathProblem.answer) {
      setFeedback("Brawo! Poprawna odpowiedź.");
    } else {
      setFeedback("Niestety, spróbuj ponownie.");
    }
  };

  return (
    <>
      <h2>Rozwiąż zadanie matematyczne</h2>
      <p>{mathProblem.question}</p>
      <input
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleSubmit} className={styles.submitButton}>
        Akceptuj
      </button>
      {feedback && <p className={styles.feedback}>{feedback}</p>}
    </>
  );
};

export default Calculator;
