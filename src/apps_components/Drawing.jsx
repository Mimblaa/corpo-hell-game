import React, { useRef, useState, useEffect } from "react";
import styles from "./AppsSection.module.css";
import { addNotification } from "../notification_components/NotificationSection"; // Import notification function

const Drawing = ({ tasks, setTasks }) => {
  const [selectedTask, setSelectedTask] = useState(null); // Track selected task
  const [feedback, setFeedback] = useState("");
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.3);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setCanvasHeight(window.innerHeight * 0.3); 
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCanvasMouseDown = (e) => {
    isDrawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    isDrawing.current = false;
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
    if (selectedTask) {
      setFeedback("Brawo! Zadanie wykonane.");
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
    }
  };

  const handleClose = () => {
    setSelectedTask(null); // Reset selected task
    setFeedback(""); // Clear feedback
  };

  return (
    <div className={styles.drawingContainer}>
      <div className={styles.scrollableContent}>
        {!selectedTask ? (
          <>
            <h3 className={styles.drawingSubtitle}>Zadania związane z Grafiką</h3>
            <select
              className={`${styles.select} ${styles.enhancedSelect}`}
              onChange={(e) => {
                const selectedId = e.target.value;
                if (selectedId) {
                  setSelectedTask(tasks.find((task) => task.id.toString() === selectedId));
                }
              }}
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
            {selectedTask && (
              <div className={`${styles.taskDetails} ${styles.enhancedTaskDetails}`}>
                <h4 className={styles.taskTitle}>Wybrane zadanie:</h4>
                <p><strong>Tytuł:</strong> {selectedTask.title}</p>
                <p><strong>Opis:</strong> {selectedTask.description}</p>
                {selectedTask.question && (
                  <p><strong>Polecenie:</strong> {selectedTask.question}</p>
                )}
              </div>
            )}
            <canvas
              ref={canvasRef}
              width={400}
              height={canvasHeight}
              className={styles.canvas}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
            />
            <button onClick={handleSubmit} className={`${styles.submitButton} ${styles.enhancedButton}`}>
              Akceptuj
            </button>
            {feedback && (
              <>
                <p className={`${styles.feedback} ${styles.enhancedFeedback}`}>{feedback}</p>
                <button onClick={handleClose} className={`${styles.closeButton} ${styles.enhancedButton}`}>
                  Zamknij
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Drawing;
