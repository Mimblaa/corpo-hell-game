"use client";
import React, { useState, useEffect } from "react";
import styles from "./NotificationSection.module.css";

const NotificationSection = () => {
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem("notifications");
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
    localStorage.setItem(
      "notifications",
      JSON.stringify(
        notifications.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      )
    );
  };

  return (
    <section className={styles.notificationSection}>
      <header className={styles.header}>
        <h2 className={styles.title}>Powiadomienia</h2>
        <button
          className={styles.clearButton}
          onClick={handleClearNotifications}
        >
          Wyczyść
        </button>
      </header>
      <ul className={styles.notificationList}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li
              key={notification.id}
              className={`${styles.notificationItem} ${
                !notification.isRead ? styles.unread : ""
              }`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <p className={styles.message}>{notification.message}</p>
              <span className={styles.time}>{notification.time}</span>
            </li>
          ))
        ) : (
          <p className={styles.emptyState}>Brak nowych powiadomień.</p>
        )}
      </ul>
    </section>
  );
};

export default NotificationSection;
