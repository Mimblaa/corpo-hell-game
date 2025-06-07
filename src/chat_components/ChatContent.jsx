"use client";
import React, { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import styles from "./ChatContent.module.css";
import videoIcon from '../assets/icons/video-icon.png';
import moreOptionsIcon from '../assets/icons/more-options-participants.png';
import yourAvatar from '../assets/icons/profile-icon.png';
import participantAvatar from '../assets/icons/user-avatar.png';
import { addNotification } from "../notification_components/NotificationSection";

const ChatContent = ({ selectedChatId, chatName, messages, onSendMessage, onChangeSection, isAiTyping }) => {
  const messageListRef = useRef(null);
  const [isInMeeting, setIsInMeeting] = useState(false);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (messageText, isAI = false) => {
    if (!messageText.trim()) return;

    onSendMessage(messageText, isAI); 
  };

  const handleStartMeeting = () => {
    const activeCall = { name: chatName, id: selectedChatId, time: new Date().toISOString() };
    localStorage.setItem("activeSection", "calls");
    localStorage.setItem("activeCall", JSON.stringify(activeCall));
    setIsInMeeting(true);
    onChangeSection("calls");
  };

  return (
    <section className={styles.chatContent}>
      <header className={styles.chatHeader}>
        <div className={styles.participantsInfo}>
          <div className={styles.participants}>
            <img
              src={participantAvatar}
              alt="Participant"
              className={styles.participantAvatar}
            />
            <div className={styles.participantNames}>
              <span className={styles.participantName}>{chatName}</span> {/* Display chat name */}
            </div>
          </div>
        </div>
        <div className={styles.chatActions}>
          <button
            className={`${styles.meetingButton} ${
              isInMeeting ? styles.active : ""
            }`}
            onClick={handleStartMeeting}
          >
            <img
              src={videoIcon}
              alt="Video"
              className={styles.actionIcon}
            />
            <span>Rozpocznij spotkanie</span>
          </button>
          <div className={styles.otherActions}>
            <img
              src={moreOptionsIcon}
              alt="More"
              className={styles.actionIcon}
              onClick={() => alert("Więcej opcji")}
              role="button"
              tabIndex={0}
            />
            <span className={styles.participantCount}>4</span>
          </div>
        </div>
      </header>
      <div className={styles.messageList} ref={messageListRef}>
        {messages.map((message) => {
          const isOwnMessage = message.sender === "You";
          return (
            <div 
              key={message.id} 
              // Apply alignment classes to this wrapper
              className={`${styles.messageWrapper} ${isOwnMessage ? styles.ownMessageWrapper : styles.otherMessageWrapper}`}
            >
              <span style={message.penalty ? { color: 'red' } : {}}>
              <MessageBubble
                message={message.message}
                sender={message.sender}
                time={message.time}
                avatar={message.avatar}
                isOwn={isOwnMessage} // isOwn is still needed for internal MessageBubble styling (e.g., avatar order)
                penalty={message.penalty}
              />
              </span>
            </div>
          );
        })}
      </div>
      {isAiTyping && <div className={styles.typingIndicator}>{chatName} pisze...</div>}
      <ChatInput onSendMessage={handleSendMessage} />
    </section>
  );
};

export default ChatContent;
