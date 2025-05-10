"use client";
import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";
import { addNotification } from "../notification_components/NotificationSection"; 

import participantAvatar from '../assets/icons/user-avatar.png';
import yourAvatar from '../assets/icons/profile-icon.png';

// Suggested prompt for OpenAI API (model gpt-4o):
// "Jesteś współpracownikiem w firmie IT. Twoje imię to {chatName} (nazwa czatu, np. 'Anna Kowalska' albo 'Zespół Projektowy X').
// Wyślij krótką, związaną z pracą wiadomość do użytkownika (który jest Twoim kolegą/koleżanką z pracy).
// Wiadomość powinna być naturalna, jak od prawdziwego kolegi/koleżanki.
// Może to być pytanie, prośba, informacja, luźny komentarz związany z pracą, albo nawet lekko pasywno-agresywna uwaga, jeśli pasuje do kontekstu korpo-środowiska.
// Zachowaj zwięzłość (1-2 zdania) i profesjonalizm, ale wiadomość może być też lekko humorystyczna lub odzwierciedlać typowe interakcje biurowe.
// Wiadomość powinna być po polsku.
// Nie używaj emoji zbyt często.
// Przykłady:
// - 'Hej, masz chwilę, żeby spojrzeć na tego buga w module XYZ?'
// - 'Może przerwa na kawę niedługo? Daj znać.'
// - 'Build znowu padł... ech. Ktoś coś wie?'
// - 'Widziałeś najnowszą notatkę o raportach TPS? Co o tym myślisz?'
// - 'Pamiętaj o spotkaniu o 14:00.'
// - 'Dzięki za pomoc z tym raportem wczoraj!'
// - 'Czy ten task na pewno jest na dzisiaj? Bo wygląda na sporo roboty.'
// - 'Słyszałem, że idziesz na urlop. Zazdroszczę!'
// Staraj się, aby wiadomości były różnorodne."

const ChatSection = ({ onChangeSection }) => {
  const [selectedChatId, setSelectedChatId] = useState(() => {
    const savedId = localStorage.getItem("selectedChatId");
    return savedId ? parseInt(savedId, 10) : 1; // Default to 1 if not found
  });

  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("chats");
    try {
      const parsedChats = savedChats ? JSON.parse(savedChats) : null;
      // Ensure defaultChats is an array, even if localStorage is empty or malformed
      return Array.isArray(parsedChats) ? parsedChats : []; 
    } catch (error) {
      console.error("Failed to parse chats from localStorage:", error);
      return []; // Default to empty array on error
    }
  });

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("messages");
    try {
      const parsedMessages = savedMessages ? JSON.parse(savedMessages) : null;
      // Ensure defaultMessages is an array
      return Array.isArray(parsedMessages) ? parsedMessages : []; 
    } catch (error) {
      console.error("Failed to parse messages from localStorage:", error);
      return []; // Default to empty array on error
    }
  });

  useEffect(() => {
    if (Array.isArray(chats)) {
      localStorage.setItem("chats", JSON.stringify(chats));
    }
    if (selectedChatId !== null && selectedChatId !== undefined) {
        localStorage.setItem("selectedChatId", selectedChatId.toString());
    }
    if (Array.isArray(messages)) {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [chats, selectedChatId, messages]);

  // Effect for automatic AI messages
  useEffect(() => {
    console.log("[AI Effect] Running. selectedChatId:", selectedChatId, "chats:", JSON.stringify(chats));
    let timerId;

    const sendAIMessageInternal = () => {
      console.log("[AI Effect] sendAIMessageInternal called. selectedChatId:", selectedChatId, "chats available:", Array.isArray(chats) && chats.length > 0);
      if (selectedChatId && Array.isArray(chats) && chats.length > 0) {
        const chat = chats.find(c => c.id === selectedChatId);
        console.log("[AI Effect] Found chat for selectedChatId:", selectedChatId, "-> chat:", JSON.stringify(chat));

        if (chat) {
          const mockMessages = [
            `Hej, masz chwilę, żeby spojrzeć na tego buga w module ${chat.name}?`,
            `Może przerwa na kawę niedługo? Daj znać.`,
            `Build dla ${chat.name} znowu padł... ech. Ktoś coś wie?`,
            `Widziałeś najnowszą notatkę o raportach TPS dotyczącą ${chat.name}? Co o tym myślisz?`,
            `Pamiętaj o deadline dla projektu "${chat.name}" jutro o 12:00.`,
            `Jak idą prace nad funkcjonalnością w ${chat.name}? Potrzebujesz może jakiejś pomocy?`,
            `Słyszałem, że mamy nowego klienta zainteresowanego produktem, nad którym pracujemy w ramach ${chat.name}.`,
            `Czy ktoś może potwierdzić, czy serwer testowy dla ${chat.name} działa poprawnie?`
          ];
          const aiText = mockMessages[Math.floor(Math.random() * mockMessages.length)];

          const newMessage = {
            sender: chat.name, // Use chat name as sender for AI
            message: aiText,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            avatar: participantAvatar,
            isAI: true,
            chatId: selectedChatId, // Ensure AI message is associated with the current chat
            id: Date.now(),
          };
          
          console.log("[AI Effect] Preparing to set new message:", JSON.stringify(newMessage));
          setMessages((prevMessages) => {
            const currentMessages = Array.isArray(prevMessages) ? prevMessages : [];
            console.log("[AI Effect] setMessages: prev length:", currentMessages.length);
            const updated = [...currentMessages, newMessage];
            console.log("[AI Effect] setMessages: new length:", updated.length);
            return updated;
          });

          try {
            const notificationMessage = `Nowa wiadomość w czacie "${chat.name}": ${aiText.substring(0, 35)}${aiText.length > 35 ? "..." : ""}`;
            addNotification(notificationMessage);
            console.log("[AI Effect] Notification sent:", notificationMessage);
          } catch (e) {
            console.error("[AI Effect] Error sending notification:", e);
          }
        } else {
          console.log("[AI Effect] No chat found for selectedChatId:", selectedChatId, ". AI message not sent.");
        }
      } else {
        console.log("[AI Effect] Conditions not met to send AI message. selectedChatId:", selectedChatId, "chats.length:", chats ? chats.length : 'N/A');
      }
    };

    const scheduleNextAIMessage = () => {
      // Shortened delay for testing: 10s to 25s. Revert to 60000-300000 for 1-5 minutes.
      const randomDelay = Math.random() * (25000 - 10000) + 10000; 
      console.log(`[AI Effect] Scheduling next AI message in ${randomDelay / 1000}s`);
      
      timerId = setTimeout(() => {
        sendAIMessageInternal();
        scheduleNextAIMessage(); // Reschedule for the next message
      }, randomDelay);
    };

    if (Array.isArray(chats) && chats.length > 0 && selectedChatId) {
      console.log("[AI Effect] Initial conditions met. Starting AI message scheduler.");
      scheduleNextAIMessage();
    } else {
      console.log("[AI Effect] Initial conditions NOT met. Scheduler not started. chats.length:", chats ? chats.length : 'N/A', "selectedChatId:", selectedChatId);
    }

    return () => {
      console.log("[AI Effect] Cleanup. Clearing timerId:", timerId);
      clearTimeout(timerId); // Cleanup on unmount or when dependencies change
    };
  }, [selectedChatId, chats]); // Rerun if selectedChatId or chats change

  const selectedChat = Array.isArray(chats) ? chats.find((chat) => chat.id === selectedChatId) : null;

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

  const handleSendMessage = (chatId, newMessageData) => { // Renamed newMessage to newMessageData to avoid conflict
    setMessages((prevMessages) => {
      const currentMessages = Array.isArray(prevMessages) ? prevMessages : [];
      return [
        ...currentMessages,
        { ...newMessageData, id: Date.now(), chatId, avatar: newMessageData.isAI ? participantAvatar : yourAvatar },
      ];
    });
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