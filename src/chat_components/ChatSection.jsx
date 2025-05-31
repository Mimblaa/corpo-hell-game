"use client";
import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";
import { addNotification } from "../notification_components/NotificationSection";
import yourAvatar from '../assets/icons/profile-icon.png';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

async function fetchOpenAIResponse(apiMessages) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_actual_openai_api_key_here") {
    console.warn("OpenAI API Key is not set or is using the placeholder value. Please check your .env file and restart the server. Returning a mock response.");
    return "To jest przykładowa odpowiedź AI, ponieważ klucz API OpenAI nie został skonfigurowany poprawnie w pliku .env.";
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: apiMessages,
        max_tokens: 100,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", response.status, errorData);
      return "Przepraszam, mam chwilowe problemy z odpowiedzią. Spróbujmy później.";
    }

    const data = await response.json();
    return data.choices[0]?.message?.content.trim() || "Nie udało mi się wygenerować odpowiedzi.";
  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
    return "Wystąpił błąd podczas komunikacji z AI. Spróbuj ponownie.";
  }
}

const fetchRandomAvatar = async () => {
  try {
    const response = await fetch("http://localhost:8000/random-face");
    if (!response.ok) throw new Error("Błąd podczas pobierania JSON-a z backendu");

    const data = await response.json();
    const imageResponse = await fetch(`http://localhost:8000/${data.avatar_url}`);
    if (!imageResponse.ok) throw new Error("Błąd podczas pobierania obrazu z URL-a");

    const blob = await imageResponse.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("fetchRandomAvatar error:", error);
    return "/default-avatar.png";
  }
};

const ChatSection = ({ onChangeSection }) => {
  const [selectedChatId, setSelectedChatId] = useState(() => {
    const savedId = localStorage.getItem("selectedChatId");
    return savedId ? parseInt(savedId, 10) : 1;
  });

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  useEffect(() => {
    const savedChats = localStorage.getItem("chats");
    const savedMessages = localStorage.getItem("messages");

    try {
      setChats(savedChats ? JSON.parse(savedChats) : []);
    } catch {
      setChats([]);
    }

    try {
      setMessages(savedMessages ? JSON.parse(savedMessages) : []);
    } catch {
      setMessages([]);
    }
  }, []);

  const getUnreadCountForChat = (chatId) => {
    return messages.filter((msg) => msg.chatId === chatId && msg.isUnread).length;
  };

  useEffect(() => {
    const defaultChatNames = [
      "Kamil Kochan",
      "Jakub Grelowski",
      "Joanna Orzeł",
      "Tomasz Michalski",
      "Manager"
    ];

    const initChats = async () => {
      const currentChats = [...chats];
      let nextId = currentChats.length > 0 ? Math.max(...currentChats.map(chat => chat.id), 0) + 1 : 1;
      let newChatsAdded = false;

      for (const name of defaultChatNames) {
        if (!currentChats.some(chat => chat.name === name)) {
          const avatar = await fetchRandomAvatar();
          currentChats.push({
            id: nextId++,
            name,
            avatar
          });
          newChatsAdded = true;
        }
      }

      if (newChatsAdded) {
        if (!selectedChatId && currentChats.length > 0 && !localStorage.getItem("selectedChatId")) {
          setSelectedChatId(currentChats[0].id);
        }
        setChats(currentChats);
      }
    };

    initChats();
  }, []);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
    localStorage.setItem("messages", JSON.stringify(messages));
    if (selectedChatId !== null && selectedChatId !== undefined) {
      localStorage.setItem("selectedChatId", selectedChatId.toString());
    }
  }, [chats, messages, selectedChatId]);

  useEffect(() => {
    let timerId;

    const sendAIMessageInternal = async () => {
      const chat = chats.find(c => c.id === selectedChatId);
      if (!chat) return;

      setIsAiTyping(true);

      const systemPrompt = `Jesteś współpracownikiem w firmie IT. Twoje imię to ${chat.name}. Twoim zadaniem jest prowadzenie naturalnej, krótkiej konwersacji związanej z pracą.`;

      const chatHistoryForProactive = messages
        .filter(m => m.chatId === selectedChatId)
        .slice(-4)
        .map(msg => ({
          role: msg.isAI || msg.sender !== "You" ? "assistant" : "user",
          content: msg.message
        }));

      const proactiveApiMessages = [
        { role: "system", content: systemPrompt },
        ...chatHistoryForProactive,
        { role: "user", content: "Napisz do mnie nową, krótką wiadomość związaną z pracą." }
      ];

      const aiText = await fetchOpenAIResponse(proactiveApiMessages);
      setIsAiTyping(false);

      if (aiText) {
        const newMessage = {
          sender: chat.name,
          message: aiText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: chat.avatar,
          isAI: true,
          chatId: selectedChatId,
          id: Date.now(),
        };

        setMessages(prev => [...prev, newMessage]);

        try {
          addNotification(`Nowa wiadomość w czacie "${chat.name}": ${aiText.substring(0, 30)}...`);
        } catch (e) {
          console.error("Notification error:", e);
        }
      }
    };

    const scheduleNextAIMessage = () => {
      const randomDelay = Math.random() * (30000 - 10000) + 30000;
      timerId = setTimeout(async () => {
        await sendAIMessageInternal();
        scheduleNextAIMessage();
      }, randomDelay);
    };

    if (Array.isArray(chats) && chats.length > 0 && selectedChatId) {
      scheduleNextAIMessage();
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [selectedChatId, chats, messages]);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const handleUpdateChatName = (chatId, newName) => {
    setChats(
      chats.map((chat) =>
        chat.id === chatId ? { ...chat, name: newName } : chat
      )
    );
  };

  const handleAddChat = async () => {
    const newChatId = chats.length > 0 ? Math.max(...chats.map(chat => chat.id), 0) + 1 : 1;
    const avatar = await fetchRandomAvatar();
    const newChat = {
      id: newChatId,
      name: `New Chat ${newChatId}`,
      avatar,
    };
    setChats((prevChats) => [...prevChats, newChat]);
    setSelectedChatId(newChat.id);
  };

  const handleDeleteChat = (chatId) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
    setMessages(messages.filter((message) => message.chatId !== chatId));
    if (selectedChatId === chatId) {
      setSelectedChatId(chats.length > 1 ? chats[0].id : null);
    }
  };

  const handleSendMessage = async (chatId, newMessageData) => {
    const userMessageToSend = {
      ...newMessageData,
      id: Date.now(),
      chatId,
      sender: "You",
      avatar: yourAvatar,
    };
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...userMessageToSend, isUnread: false },
    ]);

    if (!newMessageData.isAI && selectedChat) {
      setIsAiTyping(true);

      const systemPromptForReply = `Jesteś współpracownikiem w firmie IT. Twoje imię to ${selectedChat.name}. Odpowiedz na ostatnią wiadomość użytkownika w kontekście prowadzonej rozmowy.`;

      const chatHistoryForReply = [...messages.filter(m => m.chatId === chatId), userMessageToSend]
        .slice(-5)
        .map(msg => ({
          role: msg.isAI || msg.sender !== "You" ? "assistant" : "user",
          content: msg.message
        }));

      const reactiveApiMessages = [
        { role: "system", content: systemPromptForReply },
        ...chatHistoryForReply
      ];

      const aiReplyText = await fetchOpenAIResponse(reactiveApiMessages);
      setIsAiTyping(false);

      if (aiReplyText) {
        const aiReplyMessage = {
          id: Date.now() + 1,
          chatId,
          sender: selectedChat.name,
          message: aiReplyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: selectedChat.avatar,
          isAI: true,
        };
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...aiReplyMessage, isUnread: true },
        ]);

        try {
          addNotification(`Nowa odpowiedź w czacie "${selectedChat.name}": ${aiReplyText.substring(0, 30)}...`);
        } catch (e) {
          console.error("Notification error:", e);
        }
      }
    }
  };

  return (
    <>
      <ChatList
        onSelectChat={(chatId) => {
          setSelectedChatId(chatId);
          setMessages((prev) => {
            const updated = prev.map(msg =>
              msg.chatId === chatId ? { ...msg, isUnread: false } : msg
            );
            setTimeout(() => {
              try {
                localStorage.setItem("messages", JSON.stringify(updated));
              } catch (e) {
                console.error("LocalStorage error:", e);
              }
            }, 0);
            return updated;
          });
        }}
        activeChatId={selectedChatId}
        chats={chats.map(chat => ({
          ...chat,
          unreadCount: getUnreadCountForChat(chat.id)
        }))}
        onUpdateChatName={handleUpdateChatName}
        onAddChat={handleAddChat}
        onDeleteChat={handleDeleteChat}
      />
      <ChatContent
        selectedChatId={selectedChatId}
        chatName={selectedChat?.name || "Unknown Chat"}
        messages={messages.filter((message) => message.chatId === selectedChatId)}
        onSendMessage={(newMessageText, isAI) => handleSendMessage(selectedChatId, { message: newMessageText, isAI })}
        onChangeSection={onChangeSection}
        isAiTyping={isAiTyping && selectedChatId === (messages.filter(m => m.chatId === selectedChatId).slice(-1)[0]?.chatId)}
      />
    </>
  );
};

export default ChatSection;
