"use client";
import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import styles from "./ChatContent.module.css";

// Importowanie lokalnych plików PNG
import participantAvatar from '../assets/icons/user-avatar.png';
import videoIcon from '../assets/icons/video-icon.png';
import moreOptionsIcon from '../assets/icons/more-options-participants.png';
import yourAvatar from '../assets/icons/profile-icon.png';

const ChatContent = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "user1",
      message: "message 1 to pisze ai",
      time: "26.04.24 09:34",
      avatar: participantAvatar,
      isAI: true, // This flag helps determine if the message is from AI
    },
    {
      id: 2,
      sender: "to ty",
      message: "Inna wiadomosc ble ble to ty piszesz",
      time: "26.04.24 09:35",
      avatar: yourAvatar,
      isAI: false,
    },
  ]);

  const [isInMeeting, setIsInMeeting] = useState(false);
  const messageListRef = useRef(null);

  const handleSendMessage = (message, isAI = false) => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: isAI ? "AI" : "Twoj nick",  // AI messages have different sender name
      message,
      time: new Date()
        .toLocaleString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
        .replace(",", ""),
      avatar: isAI ? participantAvatar : yourAvatar,  // Use a different avatar for AI
      isAI,  // Flag to identify AI messages
    };

    setMessages([...messages, newMessage]);
  };

  const handleStartMeeting = () => {
    setIsInMeeting(true);
    alert("Rozpoczynanie spotkania...");
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

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
              <span className={styles.participantName}>user1, user2, user3</span>
            </div>
          </div>
          <div className={styles.chatType}>Czat</div>
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
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message.message}
            sender={message.sender}
            time={message.time}
            avatar={message.avatar}
            isOwn={!message.isAI}
          />
        ))}
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </section>
  );
};

export default ChatContent;
