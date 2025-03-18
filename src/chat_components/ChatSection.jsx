"use client";
import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";

const ChatSection = () => {
  const [selectedChatId, setSelectedChatId] = useState(1); // Default to "Group Chat"
  const [chats, setChats] = useState([
    { id: 1, name: "Group Chat" },
    { id: 2, name: "New Chat 2" },
  ]);

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
    setSelectedChatId(newChat.id); // Automatically select the new chat
  };

  const handleDeleteChat = (chatId) => {
    setChats(chats.filter((chat) => chat.id !== chatId)); // Remove the chat
    if (selectedChatId === chatId) {
      setSelectedChatId(chats.length > 1 ? chats[0].id : null); // Select another chat or null
    }
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
      />
    </>
  );
};

export default ChatSection;
