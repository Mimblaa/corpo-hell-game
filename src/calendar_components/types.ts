export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  color?: string;
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  location?: string;
  attendees?: string[];
}

export interface RecurrencePattern {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  endDate?: Date;
  occurrences?: number;
  daysOfWeek?: number[];
}

export type EventAction =
  | { type: "ADD_EVENT"; event: CalendarEvent }
  | { type: "UPDATE_EVENT"; event: CalendarEvent }
  | { type: "DELETE_EVENT"; id: string }
  | { type: "MOVE_EVENT"; id: string; startTime: Date; endTime: Date };
