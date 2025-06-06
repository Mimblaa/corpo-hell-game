import React, { useState } from "react";
import styles from "./AppsSection.module.css";
import { addNotification } from "../notification_components/NotificationSection"; // Import notification function

const Notepad = ({ tasks, setTasks }) => {
  const [transcriptionTask, setTranscriptionTask] = useState("");
  const [userText, setUserText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTranscription, setShowTranscription] = useState(false);

  const handleTaskSelect = (e) => {
    const taskId = parseInt(e.target.value, 10); // Ensure taskId is a number
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTask(task);
    if (taskId) {
      setShowTranscription(true);
      setUserText("");
      setFeedback("");
      // Use question if available, otherwise fallback
      if (task && task.question) {
        setTranscriptionTask(task.question);
      } else {
        setTranscriptionTask("Przepisz ten tekst dokładnie: 'Witaj w Notatniku!'");
      }
    }
  };

  const handleCloseTranscription = () => {
    setShowTranscription(false);
    setSelectedTask(null);
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
    // For custom tasks, expected text is after colon or just the question
    let expectedText = "";
    if (selectedTask && selectedTask.question) {
      // Try to extract after colon, or use whole question
      const parts = selectedTask.question.split(": ");
      expectedText = parts.length > 1 ? parts[1].replace(/'/g, "").trim() : selectedTask.question.trim();
    } else {
      expectedText = "Witaj w Notatniku!";
    }
    if (selectedTask && userText.trim() === expectedText) {
      setFeedback("Brawo! Poprawnie przepisałeś tekst.");
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
  };

  return (
    <div className={styles.notepadContainer}>
      <div className={styles.scrollableContent}>
        <h3 className={styles.notepadSubtitle}>Zadania związane z Notatkami</h3>
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
        {showTranscription && (
          <div className={`${styles.transcriptionTask} ${styles.enhancedQuestion}`}>
            <h2 className={styles.questionTitle}>Zadanie Notatnika</h2>
            <p className={styles.questionText}>{transcriptionTask}</p>
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              className={styles.textarea}
            />
            <button onClick={handleSubmit} className={`${styles.submitButton} ${styles.enhancedButton}`}>
              Akceptuj
            </button>
            {feedback && <p className={`${styles.feedback} ${styles.enhancedFeedback}`}>{feedback}</p>}
            <button onClick={handleCloseTranscription} className={`${styles.closeButton} ${styles.enhancedButton}`}>
              Zamknij
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notepad;
