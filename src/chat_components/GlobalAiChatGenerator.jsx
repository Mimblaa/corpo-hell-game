import { useEffect } from "react";
import participantAvatar from '../assets/icons/user-avatar.png';
import { addNotification } from "../notification_components/NotificationSection";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

async function fetchOpenAIResponse(apiMessages) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_actual_openai_api_key_here") {
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
    if (!response.ok) return "Przepraszam, mam chwilowe problemy z odpowiedzią. Spróbujmy później.";
    const data = await response.json();
    return data.choices[0]?.message?.content.trim() || "Nie udało mi się wygenerować odpowiedzi.";
  } catch {
    return "Wystąpił błąd podczas komunikacji z AI. Spróbuj ponownie.";
  }
}

function getDefaultChats() {
  return [
    "Kamil Nienawiść",
    "Jakub Brukowski",
    "Joanna Jastrząb",
    "Tomasz Kamilski",
    "Manager"
  ].map((name, idx) => ({
    id: idx + 1,
    name,
    avatar: participantAvatar
  }));
}

const GlobalAiChatGenerator = ({ difficulty = "medium" }) => {
  useEffect(() => {
    let timerId;
    let min, max;
    switch (difficulty) {
      case "easy":
        min = 5 * 60 * 1000;
        max = 7 * 60 * 1000;
        break;
      case "hard":
        min = 30 * 1000;
        max = 90 * 1000;
        break;
      case "medium":
      default:
        min = 2 * 60 * 1000;
        max = 4 * 60 * 1000;
        break;
    }
    const scheduleNextMessage = () => {
      const randomDelay = min + Math.random() * (max - min);
      timerId = setTimeout(async () => {
        // Pobierz czaty i wiadomości z localStorage
        let chats = JSON.parse(localStorage.getItem("chats")) || getDefaultChats();
        let messages = JSON.parse(localStorage.getItem("messages")) || [];
        // Losuj czat
        const chat = chats[Math.floor(Math.random() * chats.length)];
        if (!chat) return scheduleNextMessage();
        // Ostatnie 4 wiadomości z tego czatu
        const chatHistory = messages.filter(m => m.chatId === chat.id).slice(-4).map(msg => ({
          role: msg.isAI || msg.sender !== "You" ? "assistant" : "user",
          content: msg.message
        }));
        const systemPrompt = `
          Jesteś współpracownikiem w firmie IT. Twoim jedynym zadaniem jest cykliczne pytanie użytkownika, czy chce zrobić jakieś zadanie bądź pomóc ci z czymś.
          Jeśli użytkownik się zgodził, podziękuj mu za to. Użyj krótkiego, uprzejmego pytania po polsku. Maksymalnie 2 krótkie zdania.`;
        const apiMessages = [
          { role: "system", content: systemPrompt },
          ...chatHistory,
          { role: "user", content: "Zapytaj się mnie czy zrobię jakieś nowe zadanie" }
        ];
        const aiText = await fetchOpenAIResponse(apiMessages);
        if (aiText) {
          const newMessage = {
            sender: chat.name,
            message: aiText,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            avatar: participantAvatar,
            isAI: true,
            chatId: chat.id,
            id: Date.now(),
            isUnread: true
          };
          messages.push(newMessage);
          localStorage.setItem("messages", JSON.stringify(messages));
          try {
            const notificationMessage = `Nowa wiadomość w czacie "${chat.name}": ${aiText.substring(0, 30)}...`;
            addNotification(notificationMessage);
          } catch {}
        }
        scheduleNextMessage();
      }, randomDelay);
    };
    scheduleNextMessage();
    return () => clearTimeout(timerId);
  }, [difficulty]);
  return null;
};

export default GlobalAiChatGenerator;
