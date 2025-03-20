import React, { useRef, useState, useEffect } from "react";
import styles from "./AppsSection.module.css";

const Drawing = ({ tasks }) => {
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

  const handleSubmit = () => {
    setFeedback("Brawo! Zadanie wykonane.");
  };

  const handleClose = () => {
    setSelectedTask(null); // Reset selected task
    setFeedback(""); // Clear feedback
  };

  return (
    <>
      <h3>Zadania związane z Grafiką</h3>
      {!selectedTask ? (
        <>
          <select
            className={styles.select}
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
          <h2>Zadanie Grafiki</h2>
          <p>{selectedTask.title}</p>
          <canvas
            ref={canvasRef}
            width={400}
            height={canvasHeight} // Use dynamic height
            className={styles.canvas}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
          />
          <button onClick={handleSubmit} className={styles.submitButton}>
            Akceptuj
          </button>
          {feedback && (
            <>
              <p className={styles.feedback}>{feedback}</p>
              <button onClick={handleClose} className={styles.closeButton}>
                Zamknij
              </button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Drawing;
