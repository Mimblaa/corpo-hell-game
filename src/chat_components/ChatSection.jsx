"use client";
import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";
import { addNotification } from "../notification_components/NotificationSection";

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

const fetchRandomAvatar = async () => {
  try {
    const response = await fetch("http://localhost:8000/random-face");
    if (!response.ok) throw new Error("Błąd podczas pobierania JSON-a z backendu");
    const data = await response.json();
    return `http://localhost:8000/${data.avatar_url}`;
  } catch (error) {
    console.error("fetchRandomAvatar error:", error);
    return participantAvatar;
  }
};

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
  const [selectedChatId, setSelectedChatId] = useState(() => {
    const savedId = localStorage.getItem("selectedChatId");
    return savedId ? parseInt(savedId, 10) : 1;
  });

  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("chats");
    try {
      const parsedChats = savedChats ? JSON.parse(savedChats) : null;
      if (Array.isArray(parsedChats)) {
        return parsedChats;
      } else {
        return []; 
      }
    } catch (error) {
      console.error("Failed to parse chats from localStorage:", error);
      return [];
    }
  });

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("messages");
    try {
      let parsedMessages = savedMessages ? JSON.parse(savedMessages) : null;
      if (!Array.isArray(parsedMessages)) return [];
      return parsedMessages;
    } catch (error) {
      console.error("Failed to parse messages from localStorage:", error);
      return [];
    }
  });
  
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(false);
  const [isChatsLoaded, setIsChatsLoaded] = useState(false);
  const [isLoadingNewChat, setIsLoadingNewChat] = useState(false);

  useEffect(() => {
    try {
      const savedChatsData = localStorage.getItem("chats");
      if (savedChatsData) setChats(JSON.parse(savedChatsData));
    } catch (e) {console.error("Error loading chats from LS:", e)}
    try {
      const savedMessagesData = localStorage.getItem("messages");
      if (savedMessagesData) setMessages(JSON.parse(savedMessagesData));
    } catch (e) {console.error("Error loading messages from LS:", e)}
    try {
      const savedSelectedChatIdData = localStorage.getItem("selectedChatId");
      if (savedSelectedChatIdData) setSelectedChatId(parseInt(savedSelectedChatIdData, 10));
    } catch (e) {console.error("Error loading selectedChatId from LS:", e)}
    setIsChatsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isChatsLoaded) return;

    if (chats.length === 0) {
      setIsLoadingAvatars(true);
      const defaultChatNames = [
        "Kamil Kochan",
        "Jakub Grelowski",
        "Joanna Orzeł",
        "Tomasz Michalski",
        "Manager"
      ];
      
      const createDefaultChats = async () => {
        let nextIdForDefault = 1;
        const newChatsPromises = defaultChatNames.map(async (name) => {
          const avatar = await fetchRandomAvatar();
          return { name, avatar };
        });
        
        try {
            const resolvedChatsData = await Promise.all(newChatsPromises);
            const newChatsWithIds = resolvedChatsData.map((chatData) => ({
                id: nextIdForDefault++, 
                ...chatData
            }));

            setChats(newChatsWithIds);
            if (newChatsWithIds.length > 0) {
                if (!selectedChatId && !localStorage.getItem("selectedChatId")) {
                    setSelectedChatId(newChatsWithIds[0].id);
                } else if (!selectedChatId && localStorage.getItem("selectedChatId") === null && newChatsWithIds.length > 0){
                    setSelectedChatId(newChatsWithIds[0].id);
                }
            }
        } catch (error) {
            console.error("Error creating default chats with fetched avatars:", error);
            let nextIdFallback = 1;
            const fallbackChats = defaultChatNames.map(name => ({
                id: nextIdFallback++,
                name,
                avatar: participantAvatar
            }));
            setChats(fallbackChats);
            if (fallbackChats.length > 0 && !selectedChatId && !localStorage.getItem("selectedChatId")) {
                setSelectedChatId(fallbackChats[0].id);
            }
        } finally {
            setIsLoadingAvatars(false);
        }
      };
      createDefaultChats();
    }
  }, [isChatsLoaded, chats.length]);

  useEffect(() => {
    if (!isChatsLoaded) return;
    if (Array.isArray(chats)) {
      localStorage.setItem("chats", JSON.stringify(chats));
    }
    if (selectedChatId !== null && selectedChatId !== undefined) {
        localStorage.setItem("selectedChatId", selectedChatId.toString());
    } else {
        localStorage.removeItem("selectedChatId");
    }
    if (Array.isArray(messages)) {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [chats, selectedChatId, messages, isChatsLoaded]);

  useEffect(() => {
    if (selectedChatId !== null && isChatsLoaded) {
      const hasUnread = messages.some(msg => msg.chatId === selectedChatId && msg.isUnread);
      if (hasUnread) {
        setMessages(prevMessages => {
          const updatedMessages = prevMessages.map(msg =>
            (msg.chatId === selectedChatId && msg.isUnread)
              ? { ...msg, isUnread: false }
              : msg
          );
          try {
            localStorage.setItem("messages", JSON.stringify(updatedMessages));
          } catch (e) {
            console.error("Failed to persist messages to localStorage after marking as read:", e);
          }
          return updatedMessages;
        });
      }
    }
  }, [selectedChatId, messages, isChatsLoaded]);

  useEffect(() => {
    console.log("[AI Effect] Initializing. selectedChatId:", selectedChatId, "chats:", JSON.stringify(chats.slice(0,2)));
    let timerId;

    const sendAIMessageInternal = async () => {
      console.log("[AI Effect] Attempting to send AI message. selectedChatId:", selectedChatId, "Chats available:", Array.isArray(chats) && chats.length > 0);
      if (selectedChatId && Array.isArray(chats) && chats.length > 0) {
        const chat = chats.find(c => c.id === selectedChatId);
        console.log("[AI Effect] Found chat for selectedChatId:", selectedChatId, "-> chat:", JSON.stringify(chat));

        if (chat) {
          setIsAiTyping(true);
          const systemPrompt = 
          `Jesteś współpracownikiem w firmie IT. Twoim jedynym zadaniem jest cykliczne pytanie użytkownika, czy chce zrobić jakieś zadanie bądź pomóc ci z czymś.
          Jeśli użytkownik się zgodził, podziękuj mu za to. Użyj krótkiego, uprzejmego pytania po polsku. Maksymalnie 2 krótkie zdania.`;

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
            { role: "user", content: "Zapytaj się mnie czy zrobię jakieś nowe zadanie" }
          ];
          
          const aiText = await fetchOpenAIResponse(proactiveApiMessages);
          setIsAiTyping(false);

          if (aiText) {
            const newMessage = {
              sender: chat.name,
              message: aiText,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              avatar: chat.avatar || participantAvatar,
              isAI: true,
              chatId: selectedChatId,
              id: Date.now(),
              isUnread: true,
            };
            
            if (selectedChatId === newMessage.chatId) {
                newMessage.isUnread = false;
            }

            console.log("[AI Effect] Preparing to set new AI message:", JSON.stringify(newMessage));
            setMessages((prevMessages) => {
              const currentMessages = Array.isArray(prevMessages) ? prevMessages : [];
              const updated = [...currentMessages, newMessage];
              return updated;
            });

            if (newMessage.isUnread) {
                try {
                  const notificationMessage = `Nowa wiadomość w czacie "${chat.name}": ${aiText.substring(0, 30)}...`;
                  addNotification(notificationMessage);
                  console.log("[AI Effect] Notification sent for AI message:", notificationMessage);
                } catch (e) {
                  console.error("[AI Effect] Error sending notification for AI message:", e);
                }
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
      if (timerId) {
      }
      console.log(`[AI Effect] Entered scheduleNextAIMessage. Current timerId before new setTimeout: ${timerId}`);
      const randomDelay = Math.random() * (30000 - 10000) + 30000; 
      console.log(`[AI Effect] Scheduling next AI message in ${randomDelay / 1000}s for chat ID ${selectedChatId}`);
      
      timerId = setTimeout(async () => {
        console.log(`[AI Effect] setTimeout callback fired for chat ID ${selectedChatId}. Timer ID was: ${timerId}. About to send and reschedule.`);
        try {
            await sendAIMessageInternal();
        } catch (e) {
            console.error("[AI Effect] Error during sendAIMessageInternal:", e);
        }
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
  }, [selectedChatId, chats, messages]);

  const getUnreadCountForChat = (chatId) => {
    return messages.filter((msg) => msg.chatId === chatId && msg.isUnread).length;
  };

  const handleUpdateChatName = (chatId, newName) => {
    setChats(
      chats.map((chat) =>
        chat.id === chatId ? { ...chat, name: newName } : chat
      )
    );
  };

  const handleAddChat = async () => {
    setIsLoadingNewChat(true);
    const newChatId = chats.length > 0 ? Math.max(...chats.map(chatItem => chatItem.id), 0) + 1 : 1;
    
    let chatName = `New Chat ${newChatId}`;
    let avatarForNewChat = participantAvatar;

    const fetchedName = await fetchRandomName();
    if (fetchedName) {
      chatName = fetchedName;
    }
    const fetchedAvatar = await fetchRandomAvatar();
    avatarForNewChat = fetchedAvatar; 

    const newChat = {
      id: newChatId,
      name: chatName,
      avatar: avatarForNewChat,
    };
    setChats((prevChats) => [...prevChats, newChat]);
    setSelectedChatId(newChat.id);
    setIsLoadingNewChat(false);
  };

  const handleDeleteChat = (chatId) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
    setMessages(messages.filter((message) => message.chatId !== chatId));
    if (selectedChatId === chatId) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId);
      setSelectedChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
  };

  const handleSendMessage = async (chatId, newMessageData) => {
    const userMessageToSend = {
      ...newMessageData,
      id: Date.now(),
      chatId,
      sender: "You", 
      avatar: yourAvatar,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUnread: false,
    };

    const positiveAnswers = ["tak", "dodaj", "zgadzam się", "oczywiście", "jasne", "proszę dodać"];
    const isPositive = positiveAnswers.some(word => newMessageData.message.toLowerCase().includes(word));

    if(!newMessageData.isAI && isPositive) {
      console.log("[USER INPUT] TASK ADDED");
    }

    setMessages((prevMessages) => {
      const currentMessages = Array.isArray(prevMessages) ? prevMessages : [];
      return [ ...currentMessages, userMessageToSend ];
    });

    if (!newMessageData.isAI && selectedChatId && chats.find(c => c.id === selectedChatId)) {
      const selectedChatFromState = chats.find(c => c.id === selectedChatId);

      if (!selectedChatFromState) {
          setIsAiTyping(false);
          return;
      }
      setIsAiTyping(true);

      const systemPromptForReply = `Jesteś współpracownikiem w firmie IT. Twoim jedynym zadaniem jest cykliczne pytanie użytkownika, czy chce zrobić jakieś zadanie bądź pomóc ci z czymś.
          Jeśli użytkownik się zgodził, podziękuj mu za to. Użyj krótkiego, uprzejmego pytania po polsku. Maksymalnie 2 krótkie zdania.`;

      const chatHistoryForReply = [...messages.filter(m => m.chatId === selectedChatId), userMessageToSend]
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
          chatId: selectedChatId,
          sender: selectedChatFromState.name,
          message: aiReplyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          avatar: selectedChatFromState.avatar || participantAvatar,
          isAI: true,
          isUnread: true, 
        };
        setMessages((prevMessages) => [
          ...prevMessages,
          aiReplyMessage,
        ]);
        
        try {
            const notificationMessage = `Nowa odpowiedź w czacie "${selectedChatFromState.name}": ${aiReplyText.substring(0, 30)}...`;
            addNotification(notificationMessage);
        } catch(e) {
            console.error("[AI Reply] Error sending notification for AI reply:", e);
        }
      }
    }
  };
  
  const selectedChat = Array.isArray(chats) ? chats.find((chat) => chat.id === selectedChatId) : null;

  if (isLoadingAvatars && chats.length === 0) { 
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
        onSelectChat={(chatId) => {
          setSelectedChatId(chatId);
        }}
        activeChatId={selectedChatId}
        chats={chats.map(chat => ({
          ...chat,
          unreadCount: getUnreadCountForChat(chat.id)
        }))}
        onUpdateChatName={handleUpdateChatName}
        onAddChat={handleAddChat}
        onDeleteChat={handleDeleteChat}
        isLoadingNewChat={isLoadingNewChat}
      />
      <ChatContent
        selectedChatId={selectedChatId}
        chatName={selectedChat?.name || "Unknown Chat"}
        messages={messages.filter((message) => message.chatId === selectedChatId)}
        onSendMessage={(newMessageText, isAI) => handleSendMessage(selectedChatId, { message: newMessageText, isAI })}
        onChangeSection={onChangeSection}
        isAiTyping={isAiTyping && selectedChatId === (messages.filter(m => m.chatId === selectedChatId && m.sender === "You").slice(-1)[0]?.chatId)}
      />
    </>
  );
};

export default ChatSection;