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
  const dayOfWeek = date.getDay();
  const diff = date.getDate() - dayOfWeek;
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
    const now = new Date();
    const roundedHour = new Date(now.setMinutes(0, 0, 0));
    const defaultEvent = {
      title: "",
      description: "",
      startTime: roundedHour,
      endTime: new Date(roundedHour.getTime() + 60 * 60 * 1000), // 1 hour duration
      location: "",
      color: "#5b5fc7",
      isRecurring: false,
    };

    setSelectedEvent(defaultEvent);
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

  // Ustalamy datę pierwszego dnia tygodnia
  const firstDayOfWeek = getFirstDayOfWeek(currentDate);

  return (
    <section className={styles.mainContent}>
      <CalendarHeader onNewEvent={handleNewEvent} />
      {/* Przekazujemy funkcje zmiany tygodnia i datę do CalendarToolbar */}
      <CalendarToolbar
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
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
