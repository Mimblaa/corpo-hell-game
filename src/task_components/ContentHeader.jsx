import React from "react";
import styles from "./TaskSection.module.css";
import { TabType } from "./types";

const ContentHeader = ({ activeTab, onTabChange, onAddTask }) => {
  return (
    <header className={styles.contentHeader}>
      <nav className={styles.tabNav}>
        <button
          className={`${styles.tabButton} ${
            activeTab === TabType.UPCOMING ? styles.active : ""
          }`}
          onClick={() => onTabChange(TabType.UPCOMING)}
        >
          Nadchodzące
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === TabType.OVERDUE ? styles.active : ""
          }`}
          onClick={() => onTabChange(TabType.OVERDUE)}
        >
          Zaległe
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === TabType.COMPLETED ? styles.active : ""
          }`}
          onClick={() => onTabChange(TabType.COMPLETED)}
        >
          Ukończone
        </button>
      </nav>
      <div className={styles.actions}>
        <div className={styles.newTaskContainer}>
          <button className={styles.newTaskButton} onClick={onAddTask}>
            <img
              src={require("../assets/icons/new-meeting.png")}
              alt="Nowe zadanie"
              width="17"
              height="17"
            />
            <span>Nowe zadanie</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ContentHeader;
