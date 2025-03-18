import React, { useRef, useState } from "react";
import styles from "./TaskSection.module.css";

const FileUpload = ({ files, onChange }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (newFiles) => {
    onChange([...files, ...Array.from(newFiles)]);
  };

  const removeFile = (fileToRemove) => {
    onChange(files.filter((file) => file !== fileToRemove));
  };

  return (
    <div className={styles.taskUpload}>
      <div
        className={`${styles.uploadZone} ${dragActive ? styles.uploadActive : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          className={styles.hiddenInput}
        />
        <p className={styles.uploadText}>
          Przeciągnij pliki tutaj lub kliknij, aby wybrać
        </p>
      </div>
      {files.length > 0 && (
        <div className={styles.fileList}>
          {files.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <span className={styles.fileName}>{file.name}</span>
              <button
                type="button"
                className={styles.removeFileButton}
                onClick={() => removeFile(file)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
