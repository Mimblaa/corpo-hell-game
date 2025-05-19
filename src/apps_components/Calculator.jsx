import React, { useState } from "react";
import styles from "./AppsSection.module.css";
import { addNotification } from "../notification_components/NotificationSection"; // Import notification function

const Calculator = ({ tasks, setTasks }) => {
  // If task has question/answers/correctAnswer, use them, otherwise fallback to random
  const generateMathProblem = (task) => {
    if (task && task.question && task.answers && task.correctAnswer) {
      return {
        question: task.question,
        answers: task.answers,
        correctAnswer: task.correctAnswer,
      };
    } else {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      return { question: `${num1} + ${num2} = ?`, answer: num1 + num2 };
    }
  };

  const [selectedTask, setSelectedTask] = useState(null);
  const [mathProblem, setMathProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleTaskSelect = (e) => {
    const taskId = parseInt(e.target.value, 10); // Ensure taskId is a number
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTask(task);
    setMathProblem(generateMathProblem(task));
    setFeedback("");
    setUserAnswer("");
  };

  const handleTaskCompletion = (task) => {
    addNotification(`Zadanie "${task.title}" zostało ukończone.`);
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
    if (selectedTask && mathProblem) {
      // If task has correctAnswer, compare as string
      if (mathProblem.correctAnswer !== undefined) {
        if (userAnswer.trim() === String(mathProblem.correctAnswer).trim()) {
          setFeedback("Brawo! Poprawna odpowiedź.");
          updatePlayerStats(selectedTask.effect, selectedTask.penalty); // Update stats
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
      } else if (mathProblem.answer !== undefined) {
        // fallback for old tasks
        if (parseInt(userAnswer, 10) === mathProblem.answer) {
          setFeedback("Brawo! Poprawna odpowiedź.");
          updatePlayerStats(selectedTask.effect, selectedTask.penalty); // Update stats
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
      }
    }
  };

  const handleCloseQuestion = () => {
    setSelectedTask(null);
    setMathProblem(null);
    setFeedback("");
    setUserAnswer("");
  };

  return (
    <div className={styles.calculatorContainer}>
      <div className={styles.scrollableContent}>
        <h2 className={styles.calculatorTitle}>Kalkulator</h2>
        <h3 className={styles.calculatorSubtitle}>Zadania związane z Kalkulatorem</h3>
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
            <p><strong>Kurs:</strong> {selectedTask.course}</p>
            <p><strong>Opis:</strong> {selectedTask.description}</p>
          </div>
        )}
        {mathProblem && (
          <div className={`${styles.mathProblem} ${styles.enhancedQuestion}`}>
            <h2 className={styles.questionTitle}>Rozwiąż zadanie matematyczne</h2>
            <p className={styles.questionText}>{mathProblem.question}</p>
            {/* Jeśli są odpowiedzi, pokaż jako radio, jeśli nie, input */}
            {Array.isArray(mathProblem.answers) && mathProblem.answers.length > 0 ? (
              <div className={styles.optionsContainer}>
                {mathProblem.answers.map((ans, idx) => (
                  <label key={idx} className={styles.enhancedOptionLabel}>
                    <input
                      type="radio"
                      name="mathQuestion"
                      value={ans}
                      checked={userAnswer === ans}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className={styles.radioInput}
                    />
                    {ans}
                  </label>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className={styles.input}
              />
            )}
            <button onClick={handleSubmit} className={`${styles.submitButton} ${styles.enhancedButton}`}>
              Akceptuj
            </button>
            {feedback && <p className={`${styles.feedback} ${styles.enhancedFeedback}`}>{feedback}</p>}
            <button onClick={handleCloseQuestion} className={`${styles.closeButton} ${styles.enhancedButton}`}>
              Zamknij pytanie
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
