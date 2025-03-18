"use client";
import React, { useState } from "react";
import styles from "./TaskSection.module.css";
import ContentHeader from "./ContentHeader";
import TaskList from "./TaskList";
import TaskFormModal from "./TaskFormModal";
import { TabType } from "./types";

const MainContent = () => {
  const [activeTab, setActiveTab] = useState(TabType.UPCOMING);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([
    // Example upcoming tasks
    {
      id: 1,
      title: "Przygotowanie prezentacji",
      dueDate: "2026-12-15T10:00:00",
      course: "Zarządzanie Projektami",
      status: "Nie przesłano",
      priority: "high", 
      tags: ["prezentacja", "projekt"],
    },
    {
      id: 2,
      title: "Zadanie domowe - Statystyka",
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
      course: "Metodologia Badań",
      status: "Po terminie",
      priority: "low", 
      tags: ["raport", "badania"],
    },
    {
      id: 4,
      title: "Projekt grupowy - Informatyka",
      dueDate: "2023-11-25T18:00:00",
      course: "Informatyka",
      status: "Po terminie",
      priority: "high", 
      tags: ["projekt", "grupowy"],
    },
    // Example completed tasks
    {
      id: 5,
      title: "Egzamin próbny - Matematyka",
      dueDate: "2023-11-20T12:00:00",
      course: "Matematyka",
      status: "Ukończone",
      priority: "medium", 
      tags: ["egzamin", "matematyka"],
    },
    {
      id: 6,
      title: "Laboratorium - Chemia",
      dueDate: "2023-11-18T14:00:00",
      course: "Chemia",
      status: "Ukończone",
      priority: "low", 
      tags: ["laboratorium", "chemia"],
    },
  ]);

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
      <ContentHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddTask={() => setIsModalOpen(true)}
      />
      {renderContent()}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </section>
  );
};

export default MainContent;
