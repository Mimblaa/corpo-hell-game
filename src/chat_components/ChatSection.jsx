"use client";
import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";

import participantAvatar from '../assets/icons/user-avatar.png';
import yourAvatar from '../assets/icons/profile-icon.png';

const ChatSection = ({ onChangeSection }) => {
  const [selectedChatId, setSelectedChatId] = useState(() => {
    return parseInt(localStorage.getItem("selectedChatId"), 10) || 1;
  });
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("chats");
    return JSON.parse(savedChats);
  });
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("messages");
    return JSON.parse(savedMessages);
  });

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
    localStorage.setItem("selectedChatId", selectedChatId);
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [chats, selectedChatId, messages]);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const handleUpdateChatName = (chatId, newName) => {
    setChats(
      chats.map((chat) =>
        chat.id === chatId ? { ...chat, name: newName } : chat
      )
    );
  };

  const handleAddChat = () => {
    const newChat = {
      id: chats.length + 1,
      name: `New Chat ${chats.length + 1}`,
    };
    setChats([...chats, newChat]);
    setSelectedChatId(newChat.id);
  };

  const handleDeleteChat = (chatId) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
    setMessages(messages.filter((message) => message.chatId !== chatId));
    if (selectedChatId === chatId) {
      setSelectedChatId(chats.length > 1 ? chats[0].id : null);
    }
  };

  const handleSendMessage = (chatId, newMessage) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, id: Date.now(), chatId, avatar: newMessage.isAI ? participantAvatar : yourAvatar }, // Assign avatar based on sender
    ]);
  };

  return (
    <>
      <ChatList
        onSelectChat={setSelectedChatId}
        activeChatId={selectedChatId}
        chats={chats}
        onUpdateChatName={handleUpdateChatName}
        onAddChat={handleAddChat}
        onDeleteChat={handleDeleteChat}
      />
      <ChatContent
        selectedChatId={selectedChatId}
        chatName={selectedChat?.name || "Unknown Chat"}
        messages={messages.filter((message) => message.chatId === selectedChatId)}
        onSendMessage={(newMessage) => handleSendMessage(selectedChatId, newMessage)}
        onChangeSection={onChangeSection}
      />
    </>
  );
};

export default ChatSection;
