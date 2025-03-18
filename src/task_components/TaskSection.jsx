"use client";
import React from "react";
import styles from "./TaskSection.module.css";
import MainContent from "./MainContent";

const TaskSection = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
      <main className={styles.container}>
                <MainContent />
      </main>
    </>
  );
};

export default TaskSection;
