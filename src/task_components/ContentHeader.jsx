import React from "react";
import styles from "./TaskSection.module.css";
import { TabType } from "./types";

const ContentHeader = ({ activeTab, onTabChange, onAddTask, onAddAiTask }) => {
  const [showAiMenu, setShowAiMenu] = React.useState(false);
  const aiTypes = [
    { type: "Calculator", label: "Kalkulator", icon: require("../assets/icons/calculator.svg") },
    { type: "Notebook", label: "Notatnik", icon: require("../assets/icons/notes.svg") },
    { type: "Browser", label: "Przeglądarka", icon: require("../assets/icons/browser.svg") },
    { type: "Mail", label: "Mail", icon: require("../assets/icons/email.svg") },
    { type: "Graphics", label: "Grafika", icon: require("../assets/icons/artist.svg") },
    { type: "Programming", label: "Programowanie", icon: require("../assets/icons/programming.svg") },
  ];
  return (
    <header className={styles.contentHeader}>
      <nav className={styles.tabNav}>
        <button
          className={`${styles.tabButton} ${activeTab === TabType.UPCOMING ? styles.active : ""}`}
          onClick={() => onTabChange(TabType.UPCOMING)}
        >
          Nadchodzące
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === TabType.OVERDUE ? styles.active : ""}`}
          onClick={() => onTabChange(TabType.OVERDUE)}
        >
          Zaległe
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === TabType.COMPLETED ? styles.active : ""}`}
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
