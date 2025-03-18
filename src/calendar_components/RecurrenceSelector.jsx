"use client";
import React from "react";
import styles from "./CalendarApp.module.css";

export const RecurrenceSelector = ({ value, onChange }) => {
  const handleFrequencyChange = (frequency) => {
    onChange({
      ...value,
      frequency,
      interval: 1,
      daysOfWeek: frequency === "weekly" ? [new Date().getDay()] : undefined,
    });
  };

  const handleIntervalChange = (interval) => {
    onChange({
      ...value,
      interval: parseInt(interval),
    });
  };

  const handleDayToggle = (day) => {
    const currentDays = value.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    onChange({
      ...value,
      daysOfWeek: newDays,
    });
  };

  return (
    <div className={styles.recurrenceSelector}>
      <div className={styles.formGroup}>
        <label htmlFor="frequency">Repeat</label>
        <select
          id="frequency"
          value={value?.frequency || "daily"}
          onChange={(e) => handleFrequencyChange(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="interval">Every</label>
        <input
          type="number"
          id="interval"
          min="1"
          value={value?.interval || 1}
          onChange={(e) => handleIntervalChange(e.target.value)}
        />
        <span>{value?.frequency || "day"}(s)</span>
      </div>

      {value?.frequency === "weekly" && (
        <div className={styles.weekDays}>
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dayButton} ${
                value.daysOfWeek?.includes(index) ? styles.selected : ""
              }`}
              onClick={() => handleDayToggle(index)}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="endDate">End Date</label>
        <input
          type="date"
          id="endDate"
          value={value?.endDate?.toISOString().slice(0, 10) || ""}
          onChange={(e) =>
            onChange({
              ...value,
              endDate: e.target.value ? new Date(e.target.value) : undefined,
            })
          }
        />
      </div>
    </div>
  );
};
