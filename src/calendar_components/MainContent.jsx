"use client";
import React, { useState, useEffect } from "react";
import styles from "./CalendarApp.module.css";
import CalendarHeader from "./CalendarHeader";
import CalendarToolbar from "./CalendarToolbar";
import CalendarGrid from "./CalendarGrid";
import { EventModal } from "./EventModal";
import { useEvents } from "./EventContext";

const getFirstDayOfWeek = (date) => {
  const dayOfWeek = date.getDay() || 7;
  const diff = date.getDate() - dayOfWeek + 1;
  return new Date(date.setDate(diff));
};

const MainContent = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    const savedDate = localStorage.getItem("currentDate");
    return savedDate ? new Date(savedDate) : new Date();
  });
  const [view, setView] = useState("Tydzień roboczy"); // Default view
  const events = useEvents();

  useEffect(() => {
    localStorage.setItem("currentDate", currentDate.toISOString());
  }, [currentDate]);

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === "Dzień") {
      newDate.setDate(currentDate.getDate() - 1); // Move back 1 day
    } else {
      newDate.setDate(currentDate.getDate() - 7); // Move back 1 week
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "Dzień") {
      newDate.setDate(currentDate.getDate() + 1); // Move forward 1 day
    } else {
      newDate.setDate(currentDate.getDate() + 7); // Move forward 1 week
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const displayedDate = view === "Dzień" ? currentDate : getFirstDayOfWeek(currentDate);

  return (
    <section className={styles.mainContent}>
      <CalendarHeader onNewEvent={handleNewEvent} />
      <CalendarToolbar
        onPrevWeek={handlePrev} // Use handlePrev for navigation
        onNextWeek={handleNext} // Use handleNext for navigation
        onToday={handleToday}
        currentWeek={displayedDate} // Pass the correct date based on the view
        onViewChange={setView} // Pass view change handler
      />
      <CalendarGrid
        currentDate={currentDate}
        onEventClick={handleEditEvent}
        view={view} // Pass selected view
      />
      {isModalOpen && <EventModal event={selectedEvent} onClose={handleCloseModal} />}
    </section>
  );
};

export default MainContent;
