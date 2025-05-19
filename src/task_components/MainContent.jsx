"use client";
import React, { useState, useEffect } from "react";
import styles from "./TaskSection.module.css";
import ContentHeader from "./ContentHeader";
import TaskList from "./TaskList";
import TaskFormModal from "./TaskFormModal";
import { TabType } from "./types";

const MainContent = () => {

  const [activeTab, setActiveTab] = useState(TabType.UPCOMING);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    const combinedTasks = savedTasks ? JSON.parse(savedTasks) : [];

    return Array.from(new Map(combinedTasks.map((task) => [task.id, task])).values());
  });
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    // Zapisz zadania do localStorage za każdym razem, gdy się zmieniają
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      status: "Nie przesłano",
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setIsModalOpen(false);
  };

  // AI Task logic
  const handleAddAiTask = async (aiType) => {
    setIsAiLoading(true);
    let prompt = "";
    switch (aiType) {
      case "Calculator":
        prompt = 'Wymyśl krótkie zadanie matematyczne (np. oblicz sumę, iloczyn, procenty, równanie). Zwróć JSON: {"title":"[unikalny, konkretny tytuł zadania]","description":"Oblicz 15% z 240","effect":{"attribute":"Efektywność","value":2},"penalty":{"attribute":"Stres","value":-1}}. Tytuł ma być konkretny, nie ogólny.';
        break;
      case "Notebook":
        prompt = 'Wymyśl zadanie polegające na sporządzeniu notatki z projektu, spotkania lub innego wydarzenia. Zwróć JSON: {"title":"[unikalny, konkretny tytuł zadania]","description":"Opisz przebieg spotkania zespołu projektowego...","effect":{"attribute":"Reputacja","value":1},"penalty":{"attribute":"Cierpliwość","value":-1}}. Tytuł ma być konkretny, nie ogólny.';
        break;
      case "Browser":
        prompt = 'Wymyśl krótkie zadanie polegające na wyszukaniu wiedzy ogólnej (np. ciekawostka, pytanie do sprawdzenia w internecie). Zwróć JSON: {"title":"[unikalny, konkretny tytuł zadania]","description":"Znajdź stolicę Kanady","effect":{"attribute":"Produktywność Teatralna","value":1},"penalty":{"attribute":"Stres","value":-1}}. Tytuł ma być konkretny, nie ogólny.';
        break;
      case "Mail":
        prompt = 'Wymyśl zadanie polegające na odpisaniu na maila. Zwróć JSON: {"title":"[unikalny, konkretny tytuł zadania]","description":"Odpowiedz na maila z prośbą o raport","effect":{"attribute":"Zaufanie Szefa","value":2},"penalty":{"attribute":"Stres","value":-1}}. Tytuł ma być konkretny, nie ogólny.';
        break;
      case "Graphics":
        prompt = 'Wymyśl zadanie polegające na wymyśleniu tematu do obrazka/grafiki. Zwróć JSON: {"title":"[unikalny, konkretny tytuł zadania]","description":"Wymyśl temat do ilustracji: ...","effect":{"attribute":"Cwaniactwo","value":1},"penalty":{"attribute":"Stres","value":-1}}. Tytuł ma być konkretny, nie ogólny.';
        break;
      case "Programming":
        prompt = 'Wymyśl proste zadanie programistyczne (np. napisz funkcję, która odwraca tekst). Zwróć JSON: {"title":"[unikalny, konkretny tytuł zadania]","description":"Napisz funkcję, która odwraca tekst","effect":{"attribute":"Efektywność","value":2},"penalty":{"attribute":"Stres","value":-1}}. Tytuł ma być konkretny, nie ogólny.';
        break;
      default:
        prompt = 'Wymyśl zadanie do wykonania w pracy biurowej. Zwróć JSON: {"title":"[unikalny, konkretny tytuł zadania]","description":"Opis zadania","effect":{"attribute":"Reputacja","value":1},"penalty":{"attribute":"Stres","value":-1}}. Tytuł ma być konkretny, nie ogólny.';
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
      };
      setTasks((prev) => [...prev, newTask]);
    } catch (e) {
      alert("Nie udało się wygenerować zadania AI: " + e.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCompleteTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: "Ukończone" } : task
      )
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case TabType.UPCOMING:
        return (
          <TaskList
            tasks={tasks}
            filter={(task) =>
              new Date(task.dueDate) >= new Date() && task.status !== "Ukończone"
            }
            onComplete={handleCompleteTask}
          />
        );
      case TabType.OVERDUE:
        return (
          <TaskList
            tasks={tasks}
            filter={(task) =>
              new Date(task.dueDate) < new Date() && task.status !== "Ukończone"
            }
            onComplete={handleCompleteTask}
          />
        );
      case TabType.COMPLETED:
        return (
          <TaskList
            tasks={tasks}
            filter={(task) => task.status === "Ukończone"}
          />
        );
      default:
        return <TaskList tasks={tasks} />;
    }
  };

  return (
    <section className={styles.mainContent}>
      <div className={styles.scrollableContainer}>
        <ContentHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddTask={() => setIsModalOpen(true)}
          onAddAiTask={handleAddAiTask}
        />
        {isAiLoading && (
          <div style={{ padding: 16, color: '#5b5fc7', fontWeight: 600 }}>Generowanie zadania AI...</div>
        )}
        {renderContent()}
      </div>
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </section>
  );
};

export default MainContent;
