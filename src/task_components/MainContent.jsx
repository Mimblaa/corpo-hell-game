"use client";
import React, { useState, useEffect } from "react";
import styles from "./TaskSection.module.css";
import ContentHeader from "./ContentHeader";
import TaskList from "./TaskList";
import TaskFormModal from "./TaskFormModal";
import { TabType } from "./types";

const MainContent = () => {
  const defaultTasks = [
      {
        id: 1,
        title: "Przygotowanie prezentacji",
        dueDate: "2026-12-15T10:00:00",
        course: "Grafika",
        status: "Nie przesłano",
        priority: "high", 
        tags: ["prezentacja", "projekt"],
      },
      {
        id: 2,
        title: "Utworz zbiór danych",
        dueDate: "2026-12-20T23:59:00",
        course: "Statystyka",
        status: "Nie przesłano",
        priority: "medium", 
        tags: ["zadanie", "statystyka"],
      },
      // Example overdue tasks
      {
        id: 3,
        title: "Raport z badań",
        dueDate: "2023-11-30T23:59:00",
        course: "Internet",
        status: "Po terminie",
        priority: "low", 
        tags: ["raport", "badania"],
      },
      {
        id: 4,
        title: "Prześij notatki z projektu",
        dueDate: "2023-11-25T18:00:00",
        course: "Notatki",
        status: "Po terminie",
        priority: "high", 
        tags: ["projekt", "notatki"],
      },
      {
        id: 5,
        title: "Oblicz braki w danych",
        dueDate: "2023-11-20T12:00:00",
        course: "Matematyka",
        status: "Ukończone",
        priority: "medium", 
        tags: ["matematyka"],
      },
      {
        id: 6,
        title: "Przygotuj agende spotkania",
        dueDate: "2023-11-18T14:00:00",
        course: "Internet",
        status: "Ukończone",
        priority: "low", 
        tags: ["spotkania"],
      }, 
      {
        id: 7,
        title: "Odpisz klientowi",
        dueDate: "2023-11-18T14:00:00",
        course: "Korespondencja",
        status: "Nie przesłano",
        priority: "low", 
        tags: ["mail"],
      }, 
  ];

  const [activeTab, setActiveTab] = useState(TabType.UPCOMING);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    const combinedTasks = savedTasks
      ? [...defaultTasks, ...JSON.parse(savedTasks)]
      : defaultTasks;

    return Array.from(new Map(combinedTasks.map((task) => [task.id, task])).values());
  });

  useEffect(() => {
    // Zapisz zadania do localStorage za każdym razem, gdy się zmieniają
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks.filter((task) => !defaultTasks.some((dt) => dt.id === task.id)))
    );
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
        />
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
