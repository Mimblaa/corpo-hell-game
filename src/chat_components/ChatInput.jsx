"use client"; 
import React, { useState } from "react";
import styles from "./ChatInput.module.css";

import formatOptionsIcon from '../assets/icons/format-options.png';
import sendIcon from '../assets/icons/send-icon.png';
import aiSendIcon from '../assets/icons/send-icon.png'; // Add AI send icon

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e, isAI = false) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, isAI);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);  // Standard message submit
    }
  };

  return (
    <form className={styles.inputContainer} onSubmit={(e) => handleSubmit(e)}>
      <input
        type="text"
        placeholder="Wpisz wiadomość"
        className={styles.textInput}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <div className={styles.actions}>
        <img
          src={formatOptionsIcon}
          alt="Formatting options"
          className={styles.formatOptions}
          onClick={() => alert("Opcje formatowania")}
          role="button"
          tabIndex={0}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!message.trim()}
          onClick={(e) => handleSubmit(e, false)}  // Normal send button
        >
          <img
            src={sendIcon}
            alt="Send"
            className={styles.sendIcon}
          />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
