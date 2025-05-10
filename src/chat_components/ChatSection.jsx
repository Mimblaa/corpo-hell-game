"use client";
import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";
import { addNotification } from "../notification_components/NotificationSection"; // Import addNotification

import participantAvatar from '../assets/icons/user-avatar.png';
import yourAvatar from '../assets/icons/profile-icon.png';

// IMPORTANT: The API key is now read from an environment variable.
// Make sure you have a .env file in your project root with:
// REACT_APP_OPENAI_API_KEY=your_actual_openai_api_key_here
// For production, this key should be handled securely, ideally via a backend proxy.
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

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

const ChatSection = ({ onChangeSection }) => {
  const [selectedChatId, setSelectedChatId] = useState(() => {
    const savedId = localStorage.getItem("selectedChatId");
    return savedId ? parseInt(savedId, 10) : 1; // Default to 1 if not found or invalid
  });

  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("chats");
    try {
      const parsedChats = savedChats ? JSON.parse(savedChats) : null;
      // Ensure it's an array, if not, initialize with a base structure
      // This helps if App.jsx hasn't populated localStorage yet or if it's corrupted.
      if (Array.isArray(parsedChats)) {
        return parsedChats;
      } else {
        // Fallback to a minimal default if localStorage is empty or invalid
        // App.jsx usually handles the full default set on "new game".
        return []; 
      }
    } catch (error) {
      console.error("Failed to parse chats from localStorage:", error);
      return []; // Default to empty array on error
    }
  });

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("messages");
    try {
      const parsedMessages = savedMessages ? JSON.parse(savedMessages) : null;
      return Array.isArray(parsedMessages) ? parsedMessages : []; // Ensure it's an array
    } catch (error) {
      console.error("Failed to parse messages from localStorage:", error);
      return []; // Default to empty array on error
    }
  });

  const [isAiTyping, setIsAiTyping] = useState(false);

  useEffect(() => {
    const defaultChatNames = [
      "Kamil Kochan",
      "Jakub Grelowski",
      "Joanna Orzeł",
      "Tomasz Michalski",
      "Manager"
    ];

    setChats(prevChats => {
      let currentChats = Array.isArray(prevChats) ? [...prevChats] : [];
      let newChatsAdded = false;
      let nextId = currentChats.length > 0 ? Math.max(...currentChats.map(chatItem => chatItem.id), 0) + 1 : 1;

      defaultChatNames.forEach(name => {
        const chatExists = currentChats.some(chat => chat.name === name);
        if (!chatExists) {
          currentChats.push({
            id: nextId++,
            name: name,
            avatar: participantAvatar,
          });
          newChatsAdded = true;
        }
      });

      if (newChatsAdded) {
        // If this is the very first set of chats being created and no chat is selected,
        // select the first one.
        if (!selectedChatId && currentChats.length > 0 && !localStorage.getItem("selectedChatId")) {
            setSelectedChatId(currentChats[0].id);
        }
        return currentChats;
      }
      return prevChats; // Return original if no changes
    });
  }, []); // Runs once on mount to ensure default chats

  useEffect(() => {
    // Save to localStorage, ensuring data is stringified correctly
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
    console.log("[AI Effect] Initializing. selectedChatId:", selectedChatId, "chats:", JSON.stringify(chats.slice(0,2))); // Log initial state
    let timerId;

    const sendAIMessageInternal = async () => {
      console.log("[AI Effect] Attempting to send AI message. selectedChatId:", selectedChatId, "Chats available:", Array.isArray(chats) && chats.length > 0);
      if (selectedChatId && Array.isArray(chats) && chats.length > 0) {
        const chat = chats.find(c => c.id === selectedChatId);
        console.log("[AI Effect] Found chat for selectedChatId:", selectedChatId, "-> chat:", JSON.stringify(chat));

        if (chat) {
          setIsAiTyping(true);
          const systemPrompt = `Jesteś współpracownikiem w firmie IT. Twoje imię to ${chat.name}. Twoim zadaniem jest prowadzenie naturalnej, krótkiej konwersacji związanej z pracą. Wiadomości powinny być po polsku, profesjonalne, ale mogą być też lekko humorystyczne lub odzwierciedlać typowe interakcje biurowe. Unikaj zbyt częstego używania emoji. Staraj się, aby wiadomości były różnorodne. Odpowiadaj zwięźle, maksymalnie 1-2 zdania.`;
          
          const chatHistoryForProactive = messages
            .filter(m => m.chatId === selectedChatId)
            .slice(-4) // last 4 messages for context
            .map(msg => ({
              role: msg.isAI || msg.sender !== "You" ? "assistant" : "user",
              content: msg.message
            }));

          const proactiveApiMessages = [
            { role: "system", content: systemPrompt },
            ...chatHistoryForProactive,
            { role: "user", content: "Napisz do mnie nową, krótką wiadomość związaną z pracą, kontynuując lub rozpoczynając rozmowę." }
          ];
          
          const aiText = await fetchOpenAIResponse(proactiveApiMessages);
          setIsAiTyping(false);

          if (aiText) {
            const newMessage = {
              sender: chat.name,
              message: aiText,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              avatar: participantAvatar,
              isAI: true,
              chatId: selectedChatId,
              id: Date.now(),
            };
            
            console.log("[AI Effect] Preparing to set new AI message:", JSON.stringify(newMessage));
            setMessages((prevMessages) => {
              const currentMessages = Array.isArray(prevMessages) ? prevMessages : [];
              const updated = [...currentMessages, newMessage];
              return updated;
            });

            try {
              const notificationMessage = `Nowa wiadomość w czacie "${chat.name}": ${aiText.substring(0, 30)}...`;
              addNotification(notificationMessage);
              console.log("[AI Effect] Notification sent for AI message:", notificationMessage);
            } catch (e) {
              console.error("[AI Effect] Error sending notification for AI message:", e);
            }
          } else {
            console.log("[AI Effect] Failed to get AI message text.");
          }
        } else {
          console.log("[AI Effect] No chat found for selectedChatId:", selectedChatId, ". AI message not sent.");
        }
      } else {
        console.log("[AI Effect] Conditions not met to send AI message. selectedChatId:", selectedChatId, "chats.length:", chats ? chats.length : 'N/A');
      }
    };

    const scheduleNextAIMessage = () => {
      // It's important to clear any existing timer before setting a new one if this function could be called unexpectedly.
      // However, in this specific recursive structure, it might not be strictly necessary if calls are always sequential.
      // For safety, especially during debugging:
      if (timerId) {
          // console.log(`[AI Effect] Clearing existing timer ${timerId} before scheduling new one.`);
          // clearTimeout(timerId); // Be cautious with this; might interfere with intended scheduling if logic isn't perfect.
      }
      console.log(`[AI Effect] Entered scheduleNextAIMessage. Current timerId before new setTimeout: ${timerId}`);

      // Random delay: 10s to 30s for testing. Revert to 60000-300000 for 1-5 minutes.
      const randomDelay = Math.random() * (30000 - 10000) + 30000; 
      console.log(`[AI Effect] Scheduling next AI message in ${randomDelay / 1000}s for chat ID ${selectedChatId}`);
      
      timerId = setTimeout(async () => { // Make the callback async
        console.log(`[AI Effect] setTimeout callback fired for chat ID ${selectedChatId}. Timer ID was: ${timerId}. About to send and reschedule.`);
        try {
            await sendAIMessageInternal(); // Await the async function
        } catch (e) {
            console.error("[AI Effect] Error during sendAIMessageInternal:", e);
        }
        // Ensure recursive call to schedule the next message
        console.log(`[AI Effect] setTimeout callback: About to call scheduleNextAIMessage() recursively for chat ID ${selectedChatId}.`);
        scheduleNextAIMessage(); 
      }, randomDelay);
      console.log(`[AI Effect] New timer started: ${timerId} for chat ID ${selectedChatId}.`);
    };

    if (Array.isArray(chats) && chats.length > 0 && selectedChatId) {
      console.log("[AI Effect] Conditions met. Starting AI message scheduler for chat ID:", selectedChatId);
      scheduleNextAIMessage();
    } else {
      console.log("[AI Effect] Initial conditions NOT met for AI scheduler. chats.length:", chats ? chats.length : 'N/A', "selectedChatId:", selectedChatId);
    }

    return () => {
      console.log("[AI Effect] Cleanup. Clearing timerId:", timerId, "for chat ID:", selectedChatId);
      clearTimeout(timerId); 
    };
  }, [selectedChatId, chats, messages]); // Re-run if selectedChatId or the chats array itself changes

  const selectedChat = Array.isArray(chats) ? chats.find((chat) => chat.id === selectedChatId) : null;

  const handleUpdateChatName = (chatId, newName) => {
    setChats(
      chats.map((chat) =>
        chat.id === chatId ? { ...chat, name: newName } : chat
      )
    );
  };

  const handleAddChat = () => {
    const newChatId = chats.length > 0 ? Math.max(...chats.map(chatItem => chatItem.id), 0) + 1 : 1;
    const newChat = {
      id: newChatId,
      name: `New Chat ${newChatId}`,
      avatar: participantAvatar, // Default avatar for new chats
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
    setMessages((prevMessages) => {
      const currentMessages = Array.isArray(prevMessages) ? prevMessages : [];
      return [...currentMessages, userMessageToSend];
    });

    // If the message is from the user (not an AI-triggered one via special button), let the AI reply
    if (!newMessageData.isAI && selectedChat) {
      setIsAiTyping(true);

      const systemPromptForReply = `Jesteś współpracownikiem w firmie IT. Twoje imię to ${selectedChat.name}. Odpowiedz na ostatnią wiadomość użytkownika w kontekście prowadzonej rozmowy. Bądź zwięzły (1-2 zdania), profesjonalny, ale możesz być też lekko humorystyczny. Wiadomość po polsku. Zachowuj się jakbyś miał 20 lat`;

      const chatHistoryForReply = [...messages.filter(m => m.chatId === chatId), userMessageToSend]
        .slice(-5) // User's message + last 4 context messages
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
          id: Date.now() + 1, // Ensure unique ID
          chatId,
          sender: selectedChat.name,
          message: aiReplyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: participantAvatar,
          isAI: true,
        };
        setMessages((prevMessages) => [...prevMessages, aiReplyMessage]);
        
        try {
            const notificationMessage = `Nowa odpowiedź w czacie "${selectedChat.name}": ${aiReplyText.substring(0, 30)}...`;
            addNotification(notificationMessage);
        } catch(e) {
            console.error("[AI Reply] Error sending notification for AI reply:", e);
        }
      }
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
        messages={messages.filter((message) => message.chatId === selectedChatId)}
        onSendMessage={(newMessageText, isAI) => handleSendMessage(selectedChatId, { message: newMessageText, isAI })}
        onChangeSection={onChangeSection}
        isAiTyping={isAiTyping && selectedChatId === (messages.filter(m => m.chatId === selectedChatId).slice(-1)[0]?.chatId)} // Show typing only for current chat
      />
    </>
  );
};

export default ChatSection;
