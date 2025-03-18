"use client";
import React, { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";

const EventContext = createContext({
  events: [],
});

const EventDispatchContext = createContext(() => {});

function eventReducer(events, action) {
  switch (action.type) {
    case "ADD_EVENT": {
      return [...events, action.event];
    }
    case "UPDATE_EVENT": {
      return events.map((event) =>
        event.id === action.event.id ? action.event : event
      );
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
  const [events, dispatch] = useReducer(eventReducer, []);

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
