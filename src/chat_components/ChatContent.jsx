"use client";
import React, { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import styles from "./ChatContent.module.css";
import videoIcon from '../assets/icons/video-icon.png';
import moreOptionsIcon from '../assets/icons/more-options-participants.png';
import yourAvatar from '../assets/icons/profile-icon.png';
import participantAvatar from '../assets/icons/user-avatar.png';

const ChatContent = ({ selectedChatId, chatName, messages, onSendMessage }) => {
  const messageListRef = useRef(null);
  const [isInMeeting, setIsInMeeting] = useState(false);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (messageText, isAI = false) => {
    if (!messageText.trim()) return;

    const newMessage = {
      sender: isAI ? "AI" : "You",
      message: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: isAI ? participantAvatar : yourAvatar,
      isAI,
    };

    onSendMessage(newMessage);
  };

  const handleStartMeeting = () => {
    setIsInMeeting(true);
    alert("Rozpoczynanie spotkania...");
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
        {messages.map((message) => (
          <div key={message.id} className={styles.messageWithAvatar}>
            <MessageBubble
              message={message.message}
              sender={message.sender}
              time={message.time}
              avatar={message.avatar}
              isOwn={!message.isAI}
            />
          </div>
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </section>
  );
};

export default ChatContent;
