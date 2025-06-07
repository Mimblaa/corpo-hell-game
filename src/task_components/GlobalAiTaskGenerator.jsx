import { useEffect } from "react";

const AI_TYPES = [
  "Calculator",
  "Notebook",
  "Browser",
  "Mail",
  "Graphics",
  "Programming"
];

// Funkcja generująca taska AI (kopiowana z MainContent, ale bez setTasks)
export async function generateAiTask(aiType = "Notebook") {
  let prompt = "";
  switch (aiType) {
    case "Calculator":
      prompt = 'Wymyśl krótkie zadanie matematyczne (np. oblicz sumę, iloczyn, procenty, równanie). Zwróć JSON: {"title":"[unikalny, konkretny tytuł zadania]","description":"Opis zadania","question":"Polecenie do wykonania (np. Oblicz 15% z 240)","answers":["36","24","15","30"],"correctAnswer":"36","effect":{"attribute":"Efektywność","value":2},"penalty":{"attribute":"Stres","value":-1}}. Tytuł i question mają być konkretne, nie ogólne. Odpowiedzi mają być różne, tylko jedna poprawna.';
      break;
    case "Notebook":
      prompt = 'Wymyśl zadanie polegające na sporządzeniu notatki z projektu, spotkania lub innego wydarzenia. Zwróć JSON: {"title":"[unikalny, konkretny tytuł zadania]","description":"Opis zadania","question":"Polecenie do wykonania (np. Opisz przebieg spotkania zespołu projektowego)","answers":[],"correctAnswer":"","effect":{"attribute":"Reputacja","value":1},"penalty":{"attribute":"Cierpliwość","value":-1}}. Tytuł i question mają być konkretne, nie ogólne.';
      break;
    case "Browser":
      prompt = 'Wymyśl krótkie zadanie polegające na wyszukaniu wiedzy ogólnej (np. ciekawostka, pytanie do sprawdzenia w internecie). Zwróć JSON: {"title":"[unikalny, konkretny tytuł zadania]","description":"Opis zadania","question":"Polecenie do wykonania (np. Znajdź stolicę Kanady)","answers":["Ottawa","Toronto","Vancouver","Montreal"],"correctAnswer":"Ottawa","effect":{"attribute":"Produktywność Teatralna","value":1},"penalty":{"attribute":"Stres","value":-1}}. Tytuł i question mają być konkretne, nie ogólne. Odpowiedzi mają być różne, tylko jedna poprawna.';
      break;
    case "Mail":
      prompt = 'Wymyśl zadanie polegające na odpisaniu na maila. Zwróć JSON: {"title":"[unikalny, konkretny tytuł zadania]","description":"Opis zadania","question":"Polecenie do wykonania (np. Odpowiedz na maila z prośbą o raport)","answers":[],"correctAnswer":"","effect":{"attribute":"Zaufanie Szefa","value":2},"penalty":{"attribute":"Stres","value":-1}}. Tytuł i question mają być konkretne, nie ogólne.';
      break;
    case "Graphics":
      prompt = 'Wymyśl zadanie polegające na wymyśleniu tematu do obrazka/grafiki. Zwróć JSON: {"title":"[unikalny, konkretny tytuł zadania]","description":"Opis zadania","question":"Polecenie do wykonania (np. Wymyśl temat do ilustracji: ...)","answers":[],"correctAnswer":"","effect":{"attribute":"Cwaniactwo","value":1},"penalty":{"attribute":"Stres","value":-1}}. Tytuł i question mają być konkretne, nie ogólne.';
      break;
    case "Programming":
      prompt = `Wymyśl proste zadanie programistyczne z trzema wariantami odpowiedzi (A, B, C) w stylu quizu ABC. Odpowiedz wyłącznie poprawnym, minimalnym JSON (bez komentarzy, bez przecinków na końcu linii, bez dodatkowego tekstu przed i po JSON). Każde pole w JSON musi dotyczyć tego samego zadania. Przykład: {"title":"Zamiana wielkości liter w tekście","description":"Napisz funkcję, która zamienia wszystkie litery w podanym tekście na przeciwne wielkości (małe na wielkie i wielkie na małe).","question":"Która z poniższych funkcji zamienia wielkość liter w tekście?","answers":["A. function swapCase(str) { return str.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('') }","B. function swapCase(str) { return str }","C. function swapCase(str) { return str.toUpperCase() }"],"correctAnswer":"A. function swapCase(str) { return str.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('') }","effect":{"attribute":"Efektywność","value":2},"penalty":{"attribute":"Stres","value":-1}}. Tytuł, opis, question i odpowiedzi muszą dotyczyć tego samego zadania. Odpowiedzi mają być różne, tylko jedna poprawna. Odpowiedzi mają być w formacie A. ..., B. ..., C. ...`;
      break;
    default:
      prompt = 'Wymyśl zadanie do wykonania w pracy biurowej. Zwróć JSON: {"title":"[unikalny, konkretny tytuł zadania]","description":"Opis zadania","question":"Polecenie do wykonania","answers":[],"correctAnswer":"","effect":{"attribute":"Reputacja","value":1},"penalty":{"attribute":"Stres","value":-1}}. Tytuł i question mają być konkretne, nie ogólne.';
  }
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Jesteś AI, które generuje zadania do gry biurowej. Odpowiadaj tylko w formacie JSON." },
          { role: "user", content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });
    if (!response.ok) throw new Error("Błąd AI: " + response.status);
    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    // Try to parse JSON from AI response
    let taskData;
    try {
      taskData = JSON.parse(content);
    } catch {
      // Try to extract JSON from text
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        taskData = JSON.parse(match[0]);
      } else {
        throw new Error("AI nie zwróciło poprawnego JSON");
      }
    }
    if (!taskData.title || !taskData.description) throw new Error("Brak wymaganych pól w zadaniu AI");
    // Losuj datę od 1 godziny do 2 tygodni od teraz
    const now = new Date();
    const minMs = 1 * 60 * 60 * 1000; // 1 godzina
    const maxMs = 14 * 24 * 60 * 60 * 1000; // 2 tygodnie
    const randomMs = minMs + Math.random() * (maxMs - minMs);
    const dueDate = new Date(now.getTime() + randomMs).toISOString().slice(0, 10);

    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      dueDate,
      priority: "medium",
      tags: [aiType.toLowerCase()],
      status: "Nie przesłano",
      effect: taskData.effect || { attribute: "", value: "" },
      penalty: taskData.penalty || { attribute: "", value: "" },
      course:
        aiType === "Calculator" ? "Matematyka" :
        aiType === "Notebook" ? "Notatki" :
        aiType === "Browser" ? "Internet" :
        aiType === "Mail" ? "Korespondencja" :
        aiType === "Graphics" ? "Grafika" :
        aiType === "Programming" ? "Programowanie" :
        "Inne",
      question: taskData.question || "",
      answers: taskData.answers || [],
      correctAnswer: taskData.correctAnswer || "",
      isNew: true,
    };
    // Dodaj do localStorage (globalnie)
    const savedTasks = localStorage.getItem("tasks");
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert("Nie udało się wygenerować zadania AI: " + e.message);
  }
}

const GlobalAiTaskGenerator = ({ difficulty = "medium" }) => {
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
    const scheduleNextTask = () => {
      const randomDelay = min + Math.random() * (max - min);
      timerId = setTimeout(async () => {
        const aiType = AI_TYPES[Math.floor(Math.random() * AI_TYPES.length)];
        await generateAiTask(aiType);
        scheduleNextTask();
      }, randomDelay);
    };
    scheduleNextTask();
    return () => clearTimeout(timerId);
  }, [difficulty]);
  return null; // Nie renderuje nic
};

export default GlobalAiTaskGenerator;
