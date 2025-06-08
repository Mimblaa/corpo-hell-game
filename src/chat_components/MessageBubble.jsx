import React, { useState } from "react";
import yourAvatar from '../assets/icons/profile-icon.png';
import styles from "./MessageBubble.module.css";
import UserAvatar from "../UserAvatar";

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
        const currentValue = parseInt(stats[mappedStat], 10);
        const changeValue = isEffect ? parseInt(statObject.value, 10) : parseInt(statObject.value, 10);
        stats[mappedStat] = currentValue + changeValue;
      }
    }
  };

  if (effect) applyStatChanges(effect, true); // Apply effect as a positive change
  if (penalty) applyStatChanges(penalty, false); // Apply penalty as a negative change

  localStorage.setItem("playerStats", JSON.stringify(stats));
};


const MessageBubble = ({ message, sender, time, avatar, isOwn, task, penalty }) => {
  const [taskHandled, setTaskHandled] = useState(() => {
    if (task && task.id) {
      const acceptedTasks = JSON.parse(localStorage.getItem("acceptedTasks") || "[]");
      return acceptedTasks.includes(task.id);
    }
    return false;
  });
  const [penaltyMessageState, setPenaltyMessageState] = useState(null);

  const markTaskAccepted = (taskId) => {
    const acceptedTasks = JSON.parse(localStorage.getItem("acceptedTasks") || "[]");
    if (!acceptedTasks.includes(taskId)) {
      acceptedTasks.push(taskId);
      localStorage.setItem("acceptedTasks", JSON.stringify(acceptedTasks));
    }
  };

  const onTaskAccept = async (task) => {
    const savedTasks = localStorage.getItem("tasks");
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    markTaskAccepted(task.id);
    setTaskHandled(true);
  };

  const onTaskRejected = async (task) => {
    const penalty = task.penalty;
    updatePlayerStats(null, penalty);
    markTaskAccepted(task.id);
    setTaskHandled(true);
    const penaltyMessageText = `Zadanie "${task.title}" zostało odrzucone. Została nałożona kara ${penalty.value} do ${penalty.attribute}.`;
    setPenaltyMessageState({ message: penaltyMessageText });
  };

  // If task is accepted/rejected, do not show buttons after reload/section change
  const isTaskAccepted = task && task.id && JSON.parse(localStorage.getItem("acceptedTasks") || "[]").includes(task.id);

  return (
    <div
      className={`${styles.messageContainer} ${isOwn ? styles.ownMessage : ""}`}
    >
      <div className={styles.avatarContainer}>
        {isOwn && avatar === yourAvatar ? (
          <div style={{width: 32, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '50%', overflow: 'hidden'}}>
            <UserAvatar size={32} />
          </div>
        ) : (
          <img src={avatar} alt={sender} className={styles.avatar} />
        )}
      </div>
      <div className={styles.contentContainer}>
        <div
          className={`${styles.messageBubble} ${isOwn ? styles.ownBubble : ""}`}
        >
            {message}
        </div>
        {task && !isTaskAccepted && !taskHandled && (
          <div>
            <span className={styles.taskText}>{task.text}</span>
            <button
              onClick={() => onTaskAccept(task)}
            >
              ✅
            </button>
            <button
              onClick={() => onTaskRejected(task)}
            >
              ❌
            </button>
          </div>
        )}
        {penaltyMessageState && (
          <div className={styles.messageBubble} style={{marginTop: 8, background: '#ffdddd', border: '1px solid #d32f2f', color: '#b71c1c'}}>
            {penaltyMessageState.message}
          </div>
        )}
        <div className={styles.messageInfo}>
          <span className={styles.sender}>{sender}</span>
          <span className={styles.time}>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
