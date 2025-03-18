"use client";
import React from "react";
import styles from "./AppHeader.module.css";

import logo from './assets/icons/logo.png';
import settingsIcon from './assets/icons/more.png';
import profileIcon from './assets/icons/profile-icon.png';

const AppHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <img
          src={logo}
          alt="Logo"
          className={styles.logo}
        />
      </div>
      <div className={styles.profileSection}>
        <img
          src={settingsIcon}
          alt="Settings"
          className={styles.settingsIcon}
          onClick={() => alert("Settings clicked")}
          role="button"
          tabIndex={0}
        />
        <img
          src={profileIcon}
          alt="Profile"
          className={styles.profileIcon}
          onClick={() => alert("Profile clicked")}
          role="button"
          tabIndex={0}
        />
      </div>
    </header>
  );
};

export default AppHeader;
