import React, { useState } from "react";
import styles from "./TaskSection.module.css";

const defaultTags = [
  "Projekt",
  "Laboratorium",
  "Wykład",
  "Egzamin",
  "Zadanie domowe",
  "Kolokwium",
  "Prezentacja",
];

const TagSelector = ({ selectedTags, onChange, predefinedTags = [] }) => {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState(predefinedTags);

  const handleAddTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]);
    }
    setInputValue("");
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      handleAddTag(newTag);
    }
  };

  return (
    <div className={styles.tagSelector}>
      <div className={styles.selectedTags}>
        {selectedTags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
            <button
              type="button"
              className={styles.removeTag}
              onClick={() => handleRemoveTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className={styles.tagInput}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Dodaj tag..."
          className={styles.input}
        />
      </div>
      <div className={styles.suggestedTags}>
        {tags
          .filter(
            (tag) =>
              !selectedTags.includes(tag) &&
              tag.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((tag) => (
            <button
              key={tag}
              type="button"
              className={styles.suggestedTag}
              onClick={() => handleAddTag(tag)}
            >
              {tag}
            </button>
          ))}
      </div>
    </div>
  );
};

export default TagSelector;
