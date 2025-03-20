import React, { useState } from "react";
import styles from "./AppsSection.module.css";

const Browser = ({ tasks }) => {
  const [generalQuestion] = useState({
    question: "Jakie jest największe zwierzę na świecie?",
    options: ["A. Słoń afrykański", "B. Płetwal błękitny", "C. Rekin wielorybi"],
    answer: "B",
  });
  const [generalAnswer, setGeneralAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (generalAnswer === generalQuestion.answer) {
      setFeedback("Brawo! Poprawna odpowiedź.");
    } else {
      setFeedback("Niestety, spróbuj ponownie.");
    }
  };

  const handleReset = () => {
    setSelectedTask(""); // Reset selected task
    setFeedback(""); // Clear feedback
  };

  const [selectedTask, setSelectedTask] = useState("");

  return (
    <>
      <h2>Zadania związane z Internetem</h2>
      <select
        className={styles.select}
        value={selectedTask}
        onChange={(e) => setSelectedTask(e.target.value)}
      >
        <option value="">Wybierz zadanie</option>
        {tasks.map((task) => (
          <option key={task.id} value={task.id}>
            {task.title} - {task.course}
          </option>
        ))}
      </select>

      {selectedTask && (
        <>
          <h2>Pytanie z wiedzy ogólnej</h2>
          <p>{generalQuestion.question}</p>
          <div>
            {generalQuestion.options.map((option, index) => (
              <label key={index} className={styles.optionLabel}>
                <input
                  type="radio"
                  name="generalQuestion"
                  value={option[0]} // Extract the letter (A, B, C)
                  onChange={(e) => setGeneralAnswer(e.target.value)}
                />
                {option}
              </label>
            ))}
          </div>
          <button onClick={handleSubmit} className={styles.submitButton}>
            Akceptuj
          </button>
          {feedback && <p className={styles.feedback}>{feedback}</p>}
{feedback && (
            <button onClick={handleReset} className={styles.resetButton}>
              Wróć do wyboru zadania
            </button>
          )}
        </>
      )}
    </>
  );
};

export default Browser;
