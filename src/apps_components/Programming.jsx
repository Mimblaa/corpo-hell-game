import React, { useState } from "react";
import styles from "./AppsSection.module.css";

const Programming = ({ tasks, setTasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleTaskSelect = (e) => {
    const taskId = parseInt(e.target.value, 10);
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTask(task);
    setFeedback("");
    setSelectedAnswer("");
  };

  const updatePlayerStats = (effect, penalty) => {
    const stats = JSON.parse(localStorage.getItem("playerStats")) || {};

    const statMapping = {
      "Reputacja": "reputation",
      "Zaufanie Szefa": "bossTrust",
      "Zaufanie Zespołu": "teamTrust",
      "Polityczny Spryt": "politicalSkill",
      "Unikanie Odpowiedzialności": "responsibilityAvoidance",
      "Cwaniactwo": "buzzwordPower",
      "Stres": "stress",
      "Cierpliwość": "patience",
      "Produktywność Teatralna": "productivityTheatre",
    };

    const applyStatChanges = (statObject, isEffect = true) => {
      if (statObject && statObject.attribute && statObject.value) {
        const mappedStat = statMapping[statObject.attribute];
        if (mappedStat) {
          const currentValue = parseInt(stats[mappedStat] || 0, 10);
          const changeValue = isEffect ? parseInt(statObject.value, 10) : parseInt(statObject.value, 10);
          stats[mappedStat] = currentValue + changeValue;
        }
      }
    };

    if (effect) applyStatChanges(effect, true);
    if (penalty) applyStatChanges(penalty, false);

    localStorage.setItem("playerStats", JSON.stringify(stats));
  };

  const handleSubmit = () => {
    let isCorrect = false;
    if (selectedTask) {
      if (selectedTask.correctAnswer && selectedTask.answers && selectedTask.answers.length > 0) {
        // Accept both: full answer string or just letter (A/B/C)
        const correct = selectedTask.correctAnswer.trim();
        const selected = selectedAnswer.trim();
        // If user selected a letter (A/B/C), check if correctAnswer starts with that letter and a dot
        if (/^[A-Z]$/.test(selected)) {
          isCorrect = correct.startsWith(selected + ".");
        } else {
          // Otherwise, compare full answer string
          isCorrect = (selected === correct);
        }
      } else {
        isCorrect = false;
      }
    }
    if (isCorrect) {
      setFeedback("Brawo! Zadanie zostało wykonane poprawnie.");
      updatePlayerStats(selectedTask.effect, selectedTask.penalty); // Update stats
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask.id ? { ...task, status: "Ukończone" } : task
        )
      );
    } else {
      setFeedback("Niestety, odpowiedź jest niepoprawna. Spróbuj ponownie.");
    }
  };

  const handleClose = () => {
    setSelectedTask(null);
    setFeedback("");
    setSelectedAnswer("");
  };

  return (
    <div className={styles.programmingContainer}>
      <div className={styles.scrollableContent}>
        <h2 className={styles.programmingTitle}>Programowanie</h2>
        <h3 className={styles.programmingSubtitle}>Zadania związane z Programowaniem</h3>
        <select
          className={`${styles.select} ${styles.enhancedSelect}`}
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
          <div className={`${styles.taskDetails} ${styles.enhancedTaskDetails}`}>
            <h4 className={styles.taskTitle}>Wybrane zadanie:</h4>
            <p><strong>Tytuł:</strong> {selectedTask.title}</p>
            <p><strong>Opis:</strong> {selectedTask.description}</p>
          </div>
        )}
        {selectedTask && (
          <div className={`${styles.programmingTask} ${styles.enhancedQuestion}`}>
            <h2 className={styles.questionTitle}>Rozwiąż zadanie programistyczne</h2>
            <p className={styles.questionText}>
              {selectedTask.question && selectedTask.question.length > 0
                ? selectedTask.question
                : selectedTask.description}
            </p>
            {/* Multiple choice answers if available */}
            {selectedTask.answers && selectedTask.answers.length > 0 ? (
              <div className={styles.optionsContainer}>
                {selectedTask.answers.map((ans, idx) => {
                  // Extract letter (A/B/C) for value if present
                  let letter = null;
                  const match = ans.match(/^([A-Z])\./);
                  if (match) letter = match[1];
                  return (
                    <label key={ans} className={styles.enhancedOptionLabel}>
                      <input
                        type="radio"
                        name="programmingQuestion"
                        value={letter || ans}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        className={styles.radioInput}
                      />
                      {ans}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div style={{ color: '#888', fontStyle: 'italic', marginBottom: 12 }}>
                (Brak wariantów odpowiedzi do tego zadania)
              </div>
            )}
            <button onClick={handleSubmit} className={`${styles.submitButton} ${styles.enhancedButton}`}>
              Akceptuj
            </button>
            {feedback && <p className={`${styles.feedback} ${styles.enhancedFeedback}`}>{feedback}</p>}
            <button onClick={handleClose} className={`${styles.closeButton} ${styles.enhancedButton}`}>
              Zamknij zadanie
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Programming;
