import React, { useState } from "react";
import styles from "./AppsSection.module.css";

const Browser = ({ tasks, setTasks }) => {
  const [generalQuestion] = useState({
    question: "Jakie jest największe zwierzę na świecie?",
    options: ["A. Słoń afrykański", "B. Płetwal błękitny", "C. Rekin wielorybi"],
    answer: "B",
  });
  const [generalAnswer, setGeneralAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedTask, setSelectedTask] = useState("");

  const handleSubmit = () => {
    if (generalAnswer === generalQuestion.answer) {
      setFeedback("Brawo! Poprawna odpowiedź.");
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === parseInt(selectedTask) ? { ...task, status: "Ukończone" } : task
        )
      );
    } else {
      setFeedback("Niestety, spróbuj ponownie.");
    }
  };

  const handleReset = () => {
    setSelectedTask("");
    setFeedback("");
  };

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
                  value={option[0]}
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
