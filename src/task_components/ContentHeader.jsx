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
          <button
            className={styles.newTaskButton}
            style={{ borderRadius: "0 4px 4px 0", marginLeft: 0 }}
            onClick={() => setShowAiMenu((v) => !v)}
            type="button"
          >
            <img
              src={require("../assets/icons/notes.svg")}
              alt="AI"
              width="17"
              height="17"
            />
            <span>AI</span>
          </button>
          {showAiMenu && (
            <div className={styles.aiTaskMenu}>
              {aiTypes.map((ai) => (
                <button
                  key={ai.type}
                  className={styles.aiTaskMenuItem}
                  onClick={() => {
                    setShowAiMenu(false);
                    onAddAiTask(ai.type);
                  }}
                  type="button"
                >
                  <img src={ai.icon} alt={ai.label} width="16" height="16" style={{ marginRight: 6 }} />
                  {ai.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ContentHeader;
