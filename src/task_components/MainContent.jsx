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
