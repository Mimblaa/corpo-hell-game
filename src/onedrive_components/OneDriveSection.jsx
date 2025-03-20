"use client";
import React, { useState, useEffect } from "react";
import styles from "./OneDriveSection.module.css";

const OneDriveSection = () => {
  const [localStorageKeys, setLocalStorageKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    const keys = Object.keys(localStorage);
    setLocalStorageKeys(keys);
  }, []);

  const handleSelectKey = (key) => {
    setSelectedKey(key);
    setKeyValue(localStorage.getItem(key) || "");
  };

  const handleUpdateKey = () => {
    if (selectedKey) {
      localStorage.setItem(selectedKey, keyValue);
      alert(`Key "${selectedKey}" updated successfully.`);
    }
  };

  const handleDeleteKey = () => {
    if (selectedKey) {
      localStorage.removeItem(selectedKey);
      setLocalStorageKeys((prevKeys) => prevKeys.filter((key) => key !== selectedKey));
      setSelectedKey("");
      setKeyValue("");
      alert(`Key "${selectedKey}" deleted successfully.`);
    }
  };

  const handleAddKey = () => {
    if (newKey.trim() && newValue.trim()) {
      localStorage.setItem(newKey, newValue);
      setLocalStorageKeys((prevKeys) => [...prevKeys, newKey]);
      setNewKey("");
      setNewValue("");
      alert(`Key "${newKey}" added successfully.`);
    }
  };

  return (
    <section className={styles.oneDriveSection}>
      <h1 className={styles.title}>OneDrive - Local Storage Panel</h1>
      <div className={styles.localStoragePanel}>
        <div className={styles.keyList}>
          <h2>Keys</h2>
          <ul>
            {localStorageKeys.map((key) => (
              <li key={key} onClick={() => handleSelectKey(key)} className={styles.keyItem}>
                {key}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.keyEditor}>
          <h2>Edit Key</h2>
          {selectedKey ? (
            <>
              <p>Selected Key: {selectedKey}</p>
              <textarea
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                className={styles.textarea}
              />
              <button onClick={handleUpdateKey} className={styles.updateButton}>
                Update
              </button>
              <button onClick={handleDeleteKey} className={styles.deleteButton}>
                Delete
              </button>
            </>
          ) : (
            <p>Select a key to edit</p>
          )}
        </div>
        <div className={styles.addKeyForm}>
          <h2>Add New Key</h2>
          <input
            type="text"
            placeholder="Key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className={styles.input}
          />
          <textarea
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className={styles.textarea}
          />
          <button onClick={handleAddKey} className={styles.addButton}>
            Add Key
          </button>
        </div>
      </div>
    </section>
  );
};

export default OneDriveSection;
