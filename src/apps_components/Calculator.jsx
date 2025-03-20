import React, { useState } from "react";
import styles from "./AppsSection.module.css";

const Calculator = ({ tasks }) => {
  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { question: `${num1} + ${num2} = ?`, answer: num1 + num2 };
  };

  const [selectedTask, setSelectedTask] = useState(null);
  const [mathProblem, setMathProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleTaskSelect = (e) => {
    const taskId = e.target.value;
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTask(task);
    setMathProblem(generateMathProblem());
    setFeedback("");
    setUserAnswer("");
  };

  const handleSubmit = () => {
    if (parseInt(userAnswer, 10) === mathProblem.answer) {
      setFeedback("Brawo! Poprawna odpowiedź.");
    } else {
      setFeedback("Niestety, spróbuj ponownie.");
    }
  };

  const handleCloseQuestion = () => {
    setSelectedTask(null);
    setMathProblem(null);
    setFeedback("");
    setUserAnswer("");
  };

  return (
    <>
      <h2>Kalkulator</h2>
      {!mathProblem ? (
        <>
          <h3>Zadania związane z Kalkulatorem</h3>
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
        </>
      ) : (
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
          <button onClick={handleCloseQuestion} className={styles.closeButton}>
            Zamknij pytanie
          </button>
        </>
      )}
    </>
  );
};

export default Calculator;
