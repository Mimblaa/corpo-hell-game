import React from "react";
import styles from "./ChatList.module.css";

import newChatIcon from '../assets/icons/new-chat.png';
import filterIcon from '../assets/icons/filter.png';
import settingsIcon from '../assets/icons/more.png';
import userAvatar from '../assets/icons/user-avatar.png';

const ChatList = () => {
  return (
    <aside className={styles.chatList}>
      <header className={styles.header}>
        <h2 className={styles.title}>Czat</h2>
        <div className={styles.actions}>
          <img
            src={newChatIcon}
            alt="New chat"
            className={styles.actionIcon}
          />
          <img
            src={filterIcon}
            alt="Filter"
            className={styles.actionIcon}
          />
          <img
            src={settingsIcon}
            alt="Settings"
            className={styles.actionIcon}
          />
        </div>
      </header>

      <div className={styles.pinnedSection}>
        <div className={styles.chatItem}>
          <div className={styles.avatarContainer}>
            <img
              src={userAvatar}
              alt="User avatar"
              className={styles.avatar}
            />
          </div>
          <span className={styles.userName}>Group Chat</span>
        </div>
      </div>
    </aside>
  );
};

export default ChatList;
