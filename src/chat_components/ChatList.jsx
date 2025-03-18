import React, { useState } from "react";
import styles from "./ChatList.module.css";

import newChatIcon from '../assets/icons/new-chat.png';
import filterIcon from '../assets/icons/filter.png';
import userAvatar from '../assets/icons/user-avatar.png';
import deleteIcon from '../assets/icons/delete.png';

const ChatList = ({ onSelectChat, activeChatId, chats, onUpdateChatName, onAddChat, onDeleteChat }) => {
  const [editingChatId, setEditingChatId] = useState(null);
  const [newChatName, setNewChatName] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEditChatName = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    setEditingChatId(chatId);
    setNewChatName(chat.name);
  };

  const handleSaveChatName = (chatId) => {
    onUpdateChatName(chatId, newChatName);
    setEditingChatId(null);
    setNewChatName("");
  };

  const toggleFilter = () => {
    setIsFilterActive(!isFilterActive);
    if (!isFilterActive) setSearchQuery("");
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={styles.chatList}>
      <header className={styles.header}>
        <h2 className={styles.title}>Czat</h2>
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={onAddChat}
          >
            <img
              src={newChatIcon}
              alt="New chat"
              className={styles.actionIcon}
            />
          </button>
          <button
            className={`${styles.actionButton} ${
              isFilterActive ? styles.activeFilter : ""
            }`}
            onClick={toggleFilter}
          >
            <img
              src={filterIcon}
              alt="Filter"
              className={styles.actionIcon}
            />
          </button>
          <button
            className={styles.actionButton} 
            onClick={() => onDeleteChat(activeChatId)}
            disabled={!activeChatId} 
          >
            <img
              src={deleteIcon}
              alt="Delete chat"
              className={styles.actionIcon}
            />
          </button>
        </div>
        {isFilterActive && (
          <div className={styles.filterPanel}>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <p className={styles.filterHint}>Type to filter chats by name</p>
          </div>
        )}
      </header>

      <div className={styles.pinnedSection}>
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`${styles.chatItem} ${
              chat.id === activeChatId ? styles.activeChat : ""
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className={styles.avatarContainer}>
              <img
                src={chat.avatar || userAvatar}
                alt="User avatar"
                className={styles.avatar}
              />
            </div>
            {editingChatId === chat.id ? (
              <input
                type="text"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                onBlur={() => handleSaveChatName(chat.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveChatName(chat.id);
                }}
                className={styles.chatNameInput}
                autoFocus
              />
            ) : (
              <span
                className={styles.userName}
                onDoubleClick={() => handleEditChatName(chat.id)}
              >
                {chat.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChatList;
