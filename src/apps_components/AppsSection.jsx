"use client";
import React, { useState, useEffect } from "react";
import styles from "./AppsSection.module.css";

import calculatorIcon from "../assets/icons/calculator.svg";
import notesIcon from "../assets/icons/notes.svg";
import browserIcon from "../assets/icons/browser.svg";
import emailIcon from "../assets/icons/email.svg";
import artistIcon from "../assets/icons/artist.svg";

import Calculator from "./Calculator";
import Notepad from "./Notepad";
import Browser from "./Browser";
import Email from "./Email";
import Drawing from "./Drawing";

const apps = [
  { id: 1, name: "Kalkulator", icon: calculatorIcon, component: Calculator, filter: (task) => task.course === "Matematyka" || task.course === "Statystyka" },
  { id: 2, name: "Notatnik", icon: notesIcon, component: Notepad, filter: (task) => task.course === "Notatki" },
  { id: 3, name: "Przeglądarka", icon: browserIcon, component: Browser, filter: (task) => task.course === "Internet" },
  { id: 4, name: "Poczta", icon: emailIcon, component: Email, filter: (task) => task.course === "Poczta" || task.course === "Korespondencja" },
  { id: 5, name: "Grafika", icon: artistIcon, component: Drawing, filter: (task) => task.course === "Grafika" },
];

const AppsSection = () => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter(
    (task) => task.status === "Nie przesłano" || task.status === "Po terminie"
  );

  const handleAppClick = (app) => {
    setSelectedApp(app);
  };

  const handleBackToApps = () => {
    setSelectedApp(null);
  };

  return (
    <section className={styles.appsSection}>
      {!selectedApp ? (
        <>
          <h1 className={styles.title}>Aplikacje</h1>
          <div className={styles.appsGrid}>
            {apps.map((app) => (
              <div
                key={app.id}
                className={styles.appCard}
                onClick={() => handleAppClick(app)}
              >
                <img src={app.icon} alt={app.name} className={styles.appIcon} />
                <div className={styles.appName}>{app.name}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.appContent}>
          <button onClick={handleBackToApps} className={styles.backButton}>
            Wróć do aplikacji
          </button>
          <selectedApp.component
            tasks={filteredTasks.filter(selectedApp.filter)}
            setTasks={setTasks} // Pass setTasks here
          />
        </div>
      )}
    </section>
  );
};

export default AppsSection;
