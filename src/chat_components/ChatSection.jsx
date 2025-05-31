"use client";
import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";
import { addNotification } from "../notification_components/NotificationSection";
import yourAvatar from '../assets/icons/profile-icon.png';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

async function fetchOpenAIResponse(apiMessages) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_actual_openai_api_key_here") {
    console.warn("OpenAI API Key is not set. Returning a mock response.");
    return "To jest przykładowa odpowiedź AI, ponieważ klucz API OpenAI nie został skonfigurowany.";
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
        max_tokens: 100, // Oryginalna wartość
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", response.status, errorData);
      return "Przepraszam, mam chwilowe problemy z odpowiedzią.";
    }

    const data = await response.json();
    return data.choices[0]?.message?.content.trim() || "Nie udało się wygenerować odpowiedzi.";
  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
    return "Wystąpił błąd podczas komunikacji z AI.";
  }
}

const fetchRandomAvatar = async () => {
  try {
    const response = await fetch("http://localhost:8000/random-face");
    if (!response.ok) throw new Error("Błąd podczas pobierania JSON-a z backendu");
    const data = await response.json();
    // Zakładamy, że backend zwraca pełny URL lub ścieżkę, którą trzeba połączyć
    // W Twoim oryginalnym kodzie było: return `http://localhost:8000/${data.avatar_url}`;
    // To jest poprawne, jeśli data.avatar_url to np. "chat_avatars/plik.jpg"
    return `http://localhost:8000/${data.avatar_url}`;
  } catch (error) {
    console.error("fetchRandomAvatar error:", error);
    return "/default-avatar.png"; // Upewnij się, że ten plik istnieje w folderze public
  }
};

// Funkcja do pobierania losowego imienia - zostaje
const fetchRandomName = async () => {
  try {
    const response = await fetch("http://localhost:8000/random-name");
    if (!response.ok) {
      console.error("Błąd podczas pobierania nazwy z backendu:", response.status);
      return null;
    }
    const data = await response.json();
    return data.full_name;
  } catch (error) {
    console.error("fetchRandomName error:", error);
    return null;
  }
};
const ChatSection = ({ onChangeSection }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isChatsLoaded, setIsChatsLoaded] = useState(false);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(false); 
  const [isLoadingNewChat, setIsLoadingNewChat] = useState(false);

  useEffect(() => {
    try {
      const savedChats = localStorage.getItem("chats");
      if (savedChats) setChats(JSON.parse(savedChats));
    } catch (e) {}
    try {
      const savedMessages = localStorage.getItem("messages");
      if (savedMessages) setMessages(JSON.parse(savedMessages));
    } catch (e) {}
    try {
      const savedSelectedChatId = localStorage.getItem("selectedChatId");
      if (savedSelectedChatId) setSelectedChatId(parseInt(savedSelectedChatId, 10));
    } catch (e) {}
    setIsChatsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isChatsLoaded) return;
    if (chats.length === 0) {
      (async () => {
      setIsLoadingAvatars(true);
      const defaultChatNames = [
        "Kamil Nienawiść",
        "Jakub Brukowski",
        "Joanna Jastrząb",
        "Tomasz Kamilski",
        "Manager"
      ];
      let nextId = 1;
      const newChats = [];
      for (const name of defaultChatNames) {
        const avatar = await fetchRandomAvatar();
        newChats.push({ id: nextId++, name, avatar });
      }
      setChats(newChats);
      if (newChats.length > 0) {
        setSelectedChatId(newChats[0].id);
      }
      setIsLoadingAvatars(false);
      })();
    }
    }, [isChatsLoaded, chats.length]);

  useEffect(() => {
    if (!isChatsLoaded) return;
    localStorage.setItem("chats", JSON.stringify(chats));
    localStorage.setItem("messages", JSON.stringify(messages));
    if (selectedChatId !== null) localStorage.setItem("selectedChatId", selectedChatId.toString());
    else localStorage.removeItem("selectedChatId"); 
  }, [chats, messages, selectedChatId, isChatsLoaded]);

  const getUnreadCountForChat = (chatId) => messages.filter(msg => msg.chatId === chatId && msg.isUnread).length;

  const handleDeleteChat = (chatId) => {
    const newChats = chats.filter(c => c.id !== chatId);
    const newMessages = messages.filter(m => m.chatId !== chatId);
    setChats(newChats);
    setMessages(newMessages);
    if (selectedChatId === chatId) {
      setSelectedChatId(newChats.length > 0 ? newChats[0].id : null);
    }
  };

  const handleAddChat = async () => {
    setIsLoadingNewChat(true);
    const newId = chats.length ? Math.max(...chats.map(c => c.id)) + 1 : 1;
    const avatar = await fetchRandomAvatar();
    
    let chatName = `New Chat ${newId}`;
    const fetchedName = await fetchRandomName();
    
    if (fetchedName) {
      chatName = fetchedName;
    } 

    const newChat = { id: newId, name: chatName, avatar };
    setChats(prevChats => [...prevChats, newChat]);
    setSelectedChatId(newId);
    setIsLoadingNewChat(false);
  };

  const handleSendMessage = async (chatId, newMessageData) => {
    const userMessage = {
      id: Date.now(),
      chatId,
      sender: "You",
      message: newMessageData.message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: yourAvatar,
      isAI: newMessageData.isAI,
      isUnread: false,
    };
    setMessages(prev => [...prev, userMessage]);

    if (!newMessageData.isAI) {
      setIsAiTyping(true);

      const selectedChat = chats.find(c => c.id === chatId);
      if (!selectedChat) {
        setIsAiTyping(false);
        return;
      }

      const systemPrompt = `Jesteś współpracownikiem w firmie IT. Twoje imię to ${selectedChat.name}. Odpowiedz na ostatnią wiadomość użytkownika w kontekście rozmowy.`;

      const chatHistory = [...messages.filter(m => m.chatId === chatId), userMessage]
        .slice(-5)
        .map(msg => ({
          role: msg.isAI || msg.sender !== "You" ? "assistant" : "user",
          content: msg.message
        }));

      const apiMessages = [{ role: "system", content: systemPrompt }, ...chatHistory];

      const aiReplyText = await fetchOpenAIResponse(apiMessages);
      setIsAiTyping(false);

      if (aiReplyText) {
        const aiReply = {
          id: Date.now() + 1,
          chatId,
          sender: selectedChat.name,
          message: aiReplyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: selectedChat.avatar,
          isAI: true,
          isUnread: true,
        };
        setMessages(prev => [...prev, aiReply]);
        try {
          addNotification(`Nowa odpowiedź w czacie "${selectedChat.name}": ${aiReplyText.substring(0, 30)}...`);
        } catch (e) {}
      }
    }
  };

  const selectedChat = chats.find(c => c.id === selectedChatId);

  if (isLoadingAvatars) { 
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div className="spinner" style={{ marginBottom: "1rem" }} />
        <p>Ładowanie... Proszę czekać</p>
      </div>
    );
  }

  return (
    <>
      <ChatList
        chats={chats.map(chat => ({
          ...chat,
          unreadCount: getUnreadCountForChat(chat.id),
        }))}
        activeChatId={selectedChatId}
        onSelectChat={id => setSelectedChatId(id)} 
        onAddChat={handleAddChat}
        onDeleteChat={handleDeleteChat}
        isLoadingNewChat={isLoadingNewChat}
      />
      <ChatContent
        selectedChatId={selectedChatId}
        chatName={selectedChat?.name || "Unknown Chat"} 
        messages={messages.filter(m => m.chatId === selectedChatId)}
        onSendMessage={(msgText, isAI) => handleSendMessage(selectedChatId, { message: msgText, isAI })}
        onChangeSection={onChangeSection}
        isAiTyping={isAiTyping && selectedChatId === (messages.filter(m => m.chatId === selectedChatId).slice(-1)[0]?.chatId)}
      />
    </>
  );
};

export default ChatSection;