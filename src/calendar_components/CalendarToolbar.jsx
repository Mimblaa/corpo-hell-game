import React, { useState } from "react";
import styles from "./CalendarApp.module.css";
import calendarIcon from "../assets/icons/calendar-icon.png";
import arrowIcon from "../assets/icons/arrow.png";
import dropdownIcon from "../assets/icons/dropdown.png";

const CalendarToolbar = ({ onPrevWeek, onNextWeek, currentWeek, onToday, onViewChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("Tydzień roboczy");

  const formattedDate = `${currentWeek.toLocaleDateString("pl-PL", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;

  const handleTodayClick = () => {
    if (onToday) {
      onToday();
    }
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
    setIsDropdownOpen(false);
    onViewChange(view); // Notify parent about the view change
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarLeft}>
        <button className={styles.toolbarButton} onClick={handleTodayClick}>
          <img src={calendarIcon} alt="Calendar Icon" width="17" height="17" />
          <span>Dzisiaj</span>
        </button>
        <div className={styles.navArrows}>
          <button className={styles.arrowButton} onClick={onPrevWeek}>
            <img src={arrowIcon} alt="Previous" width="21" height="21" />
          </button>
          <button className={styles.arrowButton} onClick={onNextWeek}>
            <img
              src={arrowIcon}
              alt="Next"
              width="21"
              height="21"
              style={{ transform: "rotateY(180deg)" }}
            />
          </button>
        </div>
        <div className={styles.dateSelector}>
          <span>{formattedDate}</span>
        </div>
      </div>
      <div className={styles.viewSelector}>
        <button
          className={styles.viewButton}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img src={dropdownIcon} alt="View Options" width="17" height="10" />
          <span>{selectedView}</span>
        </button>
        {isDropdownOpen && (
          <div className={styles.dropdownMenu}>
            <button onClick={() => handleViewChange("Dzień")}>Dzień</button>
            <button onClick={() => handleViewChange("Tydzień roboczy")}>
              Tydzień roboczy
            </button>
            <button onClick={() => handleViewChange("Tydzień")}>Tydzień</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarToolbar;
