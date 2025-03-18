export const validateEventForm = (formData) => {
  const errors = {};

  // Title validation
  if (!formData.title.trim()) {
    errors.title = "Title is required";
  } else if (formData.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }

  // Date range validation
  if (!formData.startTime) {
    errors.startTime = "Start time is required";
  }

  if (!formData.endTime) {
    errors.endTime = "End time is required";
  }

  if (formData.startTime && formData.endTime) {
    if (formData.endTime <= formData.startTime) {
      errors.endTime = "End time must be after start time";
    }

    const duration = formData.endTime - formData.startTime;
    const maxDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (duration > maxDuration) {
      errors.endTime = "Event duration cannot exceed 24 hours";
    }
  }

  // Description validation
  if (formData.description && formData.description.length > 1000) {
    errors.description = "Description must be less than 1000 characters";
  }

  // Location validation
  if (formData.location && formData.location.length > 200) {
    errors.location = "Location must be less than 200 characters";
  }

  // Recurring event validation
  if (formData.isRecurring && formData.recurrencePattern) {
    if (!formData.recurrencePattern.frequency) {
      errors.recurrence = "Frequency is required for recurring events";
    }

    if (formData.recurrencePattern.interval < 1) {
      errors.recurrence = "Interval must be at least 1";
    }

    if (
      formData.recurrencePattern.frequency === "weekly" &&
      (!formData.recurrencePattern.daysOfWeek ||
        formData.recurrencePattern.daysOfWeek.length === 0)
    ) {
      errors.recurrence = "Please select at least one day of the week";
    }
  }

  return errors;
};

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};
