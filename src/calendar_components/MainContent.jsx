"use client";
import React, { useState } from "react";
import styles from "./CalendarApp.module.css";
import CalendarHeader from "./CalendarHeader";
import CalendarToolbar from "./CalendarToolbar";
import CalendarGrid from "./CalendarGrid";
import { EventModal } from "./EventModal";
import { useEvents } from "./EventContext";

// Funkcja pomocnicza do uzyskania daty pierwszego dnia tygodnia
const getFirstDayOfWeek = (date) => {
  const dayOfWeek = date.getDay() || 7; // Treat Sunday (0) as the last day of the week (7)
  const diff = date.getDate() - dayOfWeek + 1; // Adjust to Monday as the first day of the week
  return new Date(date.setDate(diff));
};

const MainContent = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const events = useEvents();

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

  // Funkcje do zmiany daty tygodnia
  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7); // Cofnij o 7 dni
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7); // Przesuń o 7 dni do przodu
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date()); // Set the current week to today's date
  };

  // Ustalamy datę pierwszego dnia tygodnia
  const firstDayOfWeek = getFirstDayOfWeek(currentDate);

  return (
    <section className={styles.mainContent}>
      <CalendarHeader onNewEvent={handleNewEvent} />
      {/* Przekazujemy funkcje zmiany tygodnia i datę do CalendarToolbar */}
      <CalendarToolbar
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
        currentWeek={firstDayOfWeek}
      />
      {/* Przekazujemy datę do CalendarGrid */}
      <CalendarGrid
        currentDate={currentDate}
        onEventClick={handleEditEvent} // Pass the edit handler
      />
      {isModalOpen && <EventModal event={selectedEvent} onClose={handleCloseModal} />}
    </section>
  );
};

export default MainContent;
