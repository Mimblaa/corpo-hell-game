"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";

const EventContext = createContext({
  events: [],
});

const EventDispatchContext = createContext(() => {});

export function generateRecurringInstances(event) {
  const instances = [];
  if (!event.isRecurring || !event.recurrencePattern) return [event];

  const { frequency, interval, endDate, occurrences, daysOfWeek } = event.recurrencePattern;
  const MAX_INSTANCES = 30; // Limit the maximum number of instances
  let currentDate = new Date(event.startTime);
  let count = 0;

  while (
    (!endDate || currentDate <= new Date(endDate)) &&
    (!occurrences || count < occurrences) &&
    count < MAX_INSTANCES // Stop if the limit is reached
  ) {
    if (
      frequency === "weekly" &&
      daysOfWeek &&
      !daysOfWeek.includes(currentDate.getDay())
    ) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    const instance = {
      ...event,
      id: `${event.id}-${count}`,
      startTime: new Date(currentDate),
      endTime: new Date(currentDate.getTime() + (event.endTime - event.startTime)),
      isRecurring: false, // Mark individual instances as non-recurring
    };
    instances.push(instance);

    count++;
    switch (frequency) {
      case "daily":
        currentDate.setDate(currentDate.getDate() + interval);
        break;
      case "weekly":
        currentDate.setDate(currentDate.getDate() + interval * 7);
        break;
      case "monthly":
        currentDate.setMonth(currentDate.getMonth() + interval);
        break;
      case "yearly":
        currentDate.setFullYear(currentDate.getFullYear() + interval);
        break;
      default:
        break;
    }
  }

  if (count === MAX_INSTANCES) {
    console.warn(`Recurring event generation stopped after reaching the limit of ${MAX_INSTANCES} instances.`);
  }

  return instances;
}

function eventReducer(events, action) {
  switch (action.type) {
    case "ADD_EVENT": {
      const event = {
        ...action.event,
        recurrencePattern: action.event.isRecurring
          ? action.event.recurrencePattern || {
              frequency: "daily",
              interval: 1,
              endDate: null,
              occurrences: null,
              daysOfWeek: [],
            }
          : null,
      };
      const newInstances = generateRecurringInstances(event);
      return [...events, ...newInstances]; // Add all instances of the recurring event
    }
    case "UPDATE_EVENT": {
      const updatedEvent = {
        ...action.event,
        recurrencePattern: action.event.isRecurring
          ? action.event.recurrencePattern || {
              frequency: "daily",
              interval: 1,
              endDate: null,
              occurrences: null,
              daysOfWeek: [],
            }
          : null,
      };
      const updatedEvents = events.filter((e) => !e.id.startsWith(action.event.id));
      const newInstances = generateRecurringInstances(updatedEvent);
      return [...updatedEvents, ...newInstances];
    }
    case "DELETE_EVENT": {
      return events.filter((event) => event.id !== action.id);
    }
    case "MOVE_EVENT": {
      return events.map((event) => {
        if (event.id === action.id) {
          const duration =
            new Date(event.endTime).getTime() -
            new Date(event.startTime).getTime();
          const newStartTime = new Date(action.startTime);
          return {
            ...event,
            startTime: newStartTime,
            endTime: new Date(newStartTime.getTime() + duration),
          };
        }
        return event;
      });
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

export function EventProvider({ children }) {
  const [events, dispatch] = useReducer(eventReducer, [], () => {
    const savedEvents = localStorage.getItem("events");
    return savedEvents
      ? JSON.parse(savedEvents).map((event) => ({
          ...event,
          startTime: new Date(event.startTime), // Convert to Date object
          endTime: new Date(event.endTime), // Convert to Date object
        }))
      : [];
  });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  return (
    <EventContext.Provider value={events}>
      <EventDispatchContext.Provider value={dispatch}>
        {children}
      </EventDispatchContext.Provider>
    </EventContext.Provider>
  );
}

EventProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
}

export function useEventDispatch() {
  const context = useContext(EventDispatchContext);
  if (context === undefined) {
    throw new Error("useEventDispatch must be used within an EventProvider");
  }
  return context;
}

// Event PropTypes for validation
export const EventPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  startTime: PropTypes.instanceOf(Date).isRequired,
  endTime: PropTypes.instanceOf(Date).isRequired,
  color: PropTypes.string,
  isRecurring: PropTypes.bool,
  recurrencePattern: PropTypes.shape({
    frequency: PropTypes.oneOf(["daily", "weekly", "monthly", "yearly"])
      .isRequired,
    interval: PropTypes.number.isRequired,
    endDate: PropTypes.instanceOf(Date),
    occurrences: PropTypes.number,
    daysOfWeek: PropTypes.arrayOf(PropTypes.number),
  }),
  location: PropTypes.string,
  attendees: PropTypes.arrayOf(PropTypes.string),
});
