"use client";
import React, { useEffect, useState } from "react";
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
  const [unreadCount, setUnreadCount] = useState(() => {
    const savedNotifications = localStorage.getItem("notifications");
    const notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
    return notifications.filter((notification) => !notification.isRead).length;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedNotifications = localStorage.getItem("notifications");
      const notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
      setUnreadCount(notifications.filter((notification) => !notification.isRead).length);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const savedNotifications = localStorage.getItem("notifications");
      const notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
      setUnreadCount(notifications.filter((notification) => !notification.isRead).length);
    }, 500); // Update every 500ms to reflect changes in real-time

    return () => clearInterval(interval);
  }, []);

  const handleSectionChange = (section) => {
    onSectionChange(section);
  };

  const navItems = [
    {
      id: "notification",
      icon: notificationIcon,
      label: "Powiadomienia",
      badge: unreadCount,
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
            onClick={() => handleSectionChange(item.id)}
            aria-label={item.label}
          >
            <img src={item.icon} alt="" className={styles.navIcon} />
            {item.badge > 0 && (
              <span className={styles.badge}>{item.badge}</span>
            )}
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
