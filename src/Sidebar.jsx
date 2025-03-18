"use client";
import React from "react";
import styles from "./Sidebar.module.css";

import notificationIcon from './assets/icons/notification-icon.png';
import chatIcon from './assets/icons/chat-icon.png';
import teamsIcon from './assets/icons/teams-icon.png';
import tasksIcon from './assets/icons/tasks-icon.png';
import calendarIcon from './assets/icons/calendar-icon.png';
import callsIcon from './assets/icons/calls-icon.png';
import onedriveIcon from './assets/icons/onedrive-icon.png';
import appsIcon from './assets/icons/apps-icon.png';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const navItems = [
    {
      id: "notification",
      icon: notificationIcon,
      label: "Notification",
    },
    {
      id: "chat",
      icon: chatIcon,
      label: "Czat",
    },
    {
      id: "teams",
      icon: teamsIcon,
      label: "Zespoły",
    },
    {
      id: "tasks",
      icon: tasksIcon,
      label: "Zadania",
    },
    {
      id: "calendar",
      icon: calendarIcon,
      label: "Kalendarz",
    },
    {
      id: "calls",
      icon: callsIcon,
      label: "Rozmowy",
    },
    {
      id: "onedrive",
      icon: onedriveIcon,
      label: "OneDrive",
    },
    {
      id: "apps",
      icon: appsIcon,
      label: "Aplikacje",
    },
  ];

  return (
    <nav className={styles.sidebar}>
      <div className={styles.navItems}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${
              activeSection === item.id ? styles.active : ""
            }`}
            onClick={() => onSectionChange(item.id)}
            aria-label={item.label}
          >
            <img src={item.icon} alt="" className={styles.navIcon} />
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
