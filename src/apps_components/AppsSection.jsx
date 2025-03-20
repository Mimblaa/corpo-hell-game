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
  { id: 1, name: "Kalkulator", icon: calculatorIcon },
  { id: 2, name: "Notatnik", icon: notesIcon },
  { id: 3, name: "Przeglądarka", icon: browserIcon },
  { id: 4, name: "Poczta", icon: emailIcon },
  { id: 5, name: "Grafika", icon: artistIcon },
];

const AppsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(() => {
    // Load modal state from localStorage or default to false
    return localStorage.getItem("isModalOpen") === "true";
  });
  const [modalContent, setModalContent] = useState(() => {
    // Load modal content from localStorage or default to null
    return localStorage.getItem("modalContent") || null;
  });

  useEffect(() => {
    // Save modal state and content to localStorage whenever they change
    localStorage.setItem("isModalOpen", isModalOpen);
    localStorage.setItem("modalContent", modalContent);
  }, [isModalOpen, modalContent]);

  const handleAppClick = (appName) => {
    setModalContent(appName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className={styles.appsSection}>
      <h1 className={styles.title}>Aplikacje</h1>
      <div className={styles.appsGrid}>
        {apps.map((app) => (
          <div
            key={app.id}
            className={styles.appCard}
            onClick={() => handleAppClick(app.name)}
          >
            <img src={app.icon} alt={app.name} className={styles.appIcon} />
            <div className={styles.appName}>{app.name}</div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {modalContent === "Kalkulator" && <Calculator />}
            {modalContent === "Notatnik" && <Notepad />}
            {modalContent === "Przeglądarka" && <Browser />}
            {modalContent === "Poczta" && <Email />}
            {modalContent === "Grafika" && <Drawing />}
            <button onClick={closeModal} className={styles.closeButton}>
              Zamknij
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AppsSection;
