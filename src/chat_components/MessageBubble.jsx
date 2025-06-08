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
        const currentValue = parseInt(stats[mappedStat] || 0, 10); // Ensure numeric value
        const changeValue = isEffect ? parseInt(statObject.value, 10) : parseInt(statObject.value, 10); // Parse value as integer
        stats[mappedStat] = currentValue + changeValue;
      }
    }
  };

  if (effect) applyStatChanges(effect, true); // Apply effect as a positive change
  if (penalty) applyStatChanges(penalty, false); // Apply penalty as a negative change

  localStorage.setItem("playerStats", JSON.stringify(stats));
};


const MessageBubble = ({ message, sender, time, avatar, isOwn, task, penalty }) => {

  const onTaskAccept = async (task) => {
    // save task to localStorage
    const savedTasks = localStorage.getItem("tasks");
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    task.isAccepted = true;
  }

  const onTaskRejected = async (task) => {
    const penalty = task.penalty;
    updatePlayerStats(null, penalty);

    const penaltyMessageText = `Zadanie "${task.title}" zostało odrzucone. Została nałożona kara ${penalty.value} do ${penalty.attribute}.`;
    const penaltyMessage = {
      id: Date.now(),
      chatId: task.chatId,
      sender: sender,
      message: penaltyMessageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: yourAvatar,
      isAI: true,
      penalty: true,
      isUnread: true
    };

    console.log(penaltyMessage);

    // save penalty message to localStorage
    const savedMessages = localStorage.getItem("messages");
    const messages = savedMessages ? JSON.parse(savedMessages) : [];
    messages.push(penaltyMessage);
    localStorage.setItem("messages", JSON.stringify(messages));
    task.isAccepted = true;
  }

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
        {task && !task.isAccepted && (
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
        <div className={styles.messageInfo}>
          <span className={styles.sender}>{sender}</span>
          <span className={styles.time}>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
