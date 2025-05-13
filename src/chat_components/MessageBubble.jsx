import React from "react";
import yourAvatar from '../assets/icons/profile-icon.png';
import styles from "./MessageBubble.module.css";
import UserAvatar from "../UserAvatar";

const MessageBubble = ({ message, sender, time, avatar, isOwn }) => {
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
        <div className={styles.messageInfo}>
          <span className={styles.sender}>{sender}</span>
          <span className={styles.time}>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
