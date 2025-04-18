import React from "react";
import styles from "./CalendarApp.module.css";

const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div className={styles.formError} role="alert">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.errorIcon}
      >
        <path
          d="M8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0ZM8.8 12H7.2V10.4H8.8V12ZM8.8 8.8H7.2V4H8.8V8.8Z"
          fill="currentColor"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default FormError;
