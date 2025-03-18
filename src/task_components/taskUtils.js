export const formatDate = (date) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(date).toLocaleDateString("pl-PL", options);
};

export const getDayName = (date) => {
  const days = [
    "niedziela",
    "poniedziałek",
    "wtorek",
    "środa",
    "czwartek",
    "piątek",
    "sobota",
  ];
  return days[new Date(date).getDay()];
};

export const groupTasksByDate = (tasks) => {
  const grouped = tasks.reduce((acc, task) => {
    const date = task.dueDate.split("T")[0];
    if (!acc[date]) {
      acc[date] = {
        date: formatDate(date),
        day: getDayName(date),
        tasks: [],
      };
    }
    acc[date].tasks.push(task);
    return acc;
  }, {});

  return Object.values(grouped).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
};
