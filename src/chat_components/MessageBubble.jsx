import React from "react";
import styles from "./MessageBubble.module.css";

const MessageBubble = ({ message, sender, time, avatar, isOwn }) => {
  return (
    <div
      className={`${styles.messageContainer} ${isOwn ? styles.ownMessage : ""}`}
    >
      <div className={styles.avatarContainer}>
        <img src={avatar} alt={sender} className={styles.avatar} />
      </div>
      <div className={styles.contentContainer}>
        <div
          className={`${styles.messageBubble} ${isOwn ? styles.ownBubble : ""}`}
        >
          {message}
        </div>
        <div className={styles.messageInfo}>
          <span className={styles.sender}>{sender}</span>
          <span className={styles.time}>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
