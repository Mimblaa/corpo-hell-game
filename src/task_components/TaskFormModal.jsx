"use client";
import React, { useState } from "react";
import styles from "./TaskSection.module.css";
import PrioritySelector from "./PrioritySelector";
import TagSelector from "./TagSelector";
import FileUpload from "./FileUpload";
import { predefinedCourses, predefinedTags } from "./types";
import { addNotification } from "../notification_components/NotificationSection";

const attributes = [
  "Reputacja",
  "Zaufanie Szefa",
  "Zaufanie Zespołu",
  "Efektywność",
  "Polityczny Spryt",
  "Unikanie Odpowiedzialności",
  "Cwaniactwo",
  "Stres",
  "Cierpliwość",
  "Produktywność Teatralna",
];

const TaskFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    dueDate: "",
    description: "",
    priority: "medium",
    tags: [],
    files: [],
    effect: { attribute: "", value: "" },
    penalty: { attribute: "", value: "" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEffectChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      effect: { ...prev.effect, [field]: value },
    }));
  };

  const handlePenaltyChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      penalty: { ...prev.penalty, [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    const isEdit = !!formData.id;
    addNotification(
      isEdit
        ? `Zadanie "${formData.title}" zostało zaktualizowane.`
        : `Dodano nowe zadanie: "${formData.title}".`
    );

    const savedTasks = localStorage.getItem("tasks");
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    const updatedTasks = [...tasks, { id: Date.now(), ...formData }];
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    setFormData({
      title: "",
      course: "",
      dueDate: "",
      description: "",
      priority: "medium",
      tags: [],
      files: [],
      effect: { attribute: "", value: "" },
      penalty: { attribute: "", value: "" },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Dodaj nowe zadanie</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </header>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Tytuł zadania
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="course" className={styles.label}>
              Przedmiot
            </label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="" disabled>
                Wybierz przedmiot
              </option>
              {predefinedCourses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="dueDate" className={styles.label}>
              Termin
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Priorytet</label>
            <PrioritySelector
              value={formData.priority}
              onChange={(priority) =>
                setFormData((prev) => ({ ...prev, priority }))
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tagi</label>
            <TagSelector
              selectedTags={formData.tags}
              onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
              predefinedTags={predefinedTags}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Załączniki</label>
            <FileUpload
              files={formData.files}
              onChange={(files) => setFormData((prev) => ({ ...prev, files }))}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Opis</label>
            <textarea
              className={styles.textarea}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Efekt</label>
            <div className={styles.effectPenaltyGroup}>
              <select
                value={formData.effect.attribute}
                onChange={(e) => handleEffectChange("attribute", e.target.value)}
                className={styles.input}
              >
                <option value="">Wybierz cechę</option>
                {attributes.map((attr) => (
                  <option key={attr} value={attr}>
                    {attr}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={formData.effect.value}
                onChange={(e) => handleEffectChange("value", e.target.value)}
                className={styles.input}
                placeholder="Wartość"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Kara</label>
            <div className={styles.effectPenaltyGroup}>
              <select
                value={formData.penalty.attribute}
                onChange={(e) => handlePenaltyChange("attribute", e.target.value)}
                className={styles.input}
              >
                <option value="">Wybierz cechę</option>
                {attributes.map((attr) => (
                  <option key={attr} value={attr}>
                    {attr}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={formData.penalty.value}
                onChange={(e) => handlePenaltyChange("value", e.target.value)}
                className={styles.input}
                placeholder="Wartość"
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Anuluj
            </button>
            <button type="submit" className={styles.submitButton}>
              Dodaj zadanie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
