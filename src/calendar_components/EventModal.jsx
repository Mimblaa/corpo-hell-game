"use client";
import React, { useState, useEffect } from "react";
import { useEventDispatch } from "./EventContext";
import { RecurrenceSelector } from "./RecurrenceSelector";
import styles from "./CalendarApp.module.css";
import { addNotification } from "../notification_components/NotificationSection";

export const EventModal = ({ event, onClose }) => {
  const dispatch = useEventDispatch();
  const isEditMode = !!event; // Determine if the modal is in edit mode
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // Default 1-hour duration
    location: "",
    color: "#5b5fc7",
    isRecurring: false,
    recurrencePattern: null,
    attendees: [],
  });

  useEffect(() => {
    if (isEditMode) {
      setFormData(event); // Populate form with existing event data
    } else {
      // Reset form for new event
      setFormData({
        title: "",
        description: "",
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 60 * 60 * 1000),
        location: "",
        color: "#5b5fc7",
        isRecurring: false,
        recurrencePattern: null,
        attendees: [],
      });
    }
  }, [event, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }

      if (formData.endTime <= formData.startTime) {
        throw new Error("End time must be after start time");
      }

      const eventData = {
        ...formData,
        id: isEditMode ? event.id : crypto.randomUUID(),
        title: formData.title.trim(),
        description: formData.description?.trim(),
        location: formData.location?.trim(),
      };

      dispatch({
        type: isEditMode ? "UPDATE_EVENT" : "ADD_EVENT", // Differentiate between add and update
        event: eventData,
      });

      addNotification(isEditMode ? "Spotkanie zostało zaktualizowane." : "Dodano nowe spotkanie.");

      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = () => {
    if (isEditMode && event?.id) {
      dispatch({
        type: "DELETE_EVENT",
        id: event.id,
      });
    }
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-labelledby="event-modal-title"
      >
        <header className={styles.modalHeader}>
          <h2 id="event-modal-title">{isEditMode ? "Edit Event" : "Add Event"}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.eventForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="startTime">Start Time</label>
              <input
                type="datetime-local"
                id="startTime"
                value={new Date(formData.startTime.getTime() - formData.startTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startTime: new Date(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endTime">End Time</label>
              <input
                type="datetime-local"
                id="endTime"
                value={new Date(formData.endTime.getTime() - formData.endTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endTime: new Date(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="color">Color</label>
            <input
              type="color"
              id="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData({ ...formData, isRecurring: e.target.checked })
                }
              />
              Recurring Event
            </label>
          </div>

          {formData.isRecurring && (
            <RecurrenceSelector
              value={formData.recurrencePattern}
              onChange={(pattern) =>
                setFormData({ ...formData, recurrencePattern: pattern })
              }
            />
          )}

          <div className={styles.modalActions}>
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className={styles.deleteButton}
              >
                Delete
              </button>
            )}
            <button type="submit" className={styles.submitButton}>
              {isEditMode ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
