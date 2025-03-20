"use client";
import React, { useState, useEffect } from "react";
import styles from "./CalendarApp.module.css";
import CalendarHeader from "./CalendarHeader";
import CalendarToolbar from "./CalendarToolbar";
import CalendarGrid from "./CalendarGrid";
import { EventModal } from "./EventModal";
import { useEvents } from "./EventContext";

const getFirstDayOfWeek = (date) => {
  const dayOfWeek = date.getDay() || 7; // Treat Sunday (0) as the last day of the week (7)
  const diff = date.getDate() - dayOfWeek + 1; // Adjust to Monday as the first day of the week
  return new Date(date.setDate(diff));
};

const MainContent = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    // Load current date from localStorage or default to today
    const savedDate = localStorage.getItem("currentDate");
    return savedDate ? new Date(savedDate) : new Date();
  });
  const events = useEvents();

  useEffect(() => {
    // Save current date to localStorage whenever it changes
    localStorage.setItem("currentDate", currentDate.toISOString());
  }, [currentDate]);

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleNewEvent = () => {
    setSelectedEvent(null); // Pass null for new events
    setIsModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event); // Set the selected event for editing
    setIsModalOpen(true); // Open the modal
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7); // Move back 7 days
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7); // Move forward 7 days
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date()); // Set the current week to today's date
  };

  const firstDayOfWeek = getFirstDayOfWeek(currentDate);

  return (
    <section className={styles.mainContent}>
      <CalendarHeader onNewEvent={handleNewEvent} />
      <CalendarToolbar
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
        currentWeek={firstDayOfWeek}
      />
      <CalendarGrid
        currentDate={currentDate}
        onEventClick={handleEditEvent}
      />
      {isModalOpen && <EventModal event={selectedEvent} onClose={handleCloseModal} />}
    </section>
  );
};

export default MainContent;
