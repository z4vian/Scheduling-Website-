export const startOfWeekSunday = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
};

export const getWeekDates = (startDate) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
};

export const formatDate = (date) => date.toISOString().split('T')[0];

export const formatDisplayDate = (date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const getDayName = (date) =>
  date.toLocaleDateString('en-US', { weekday: 'short' });

export const calculateShiftHours = (start, end) => {
  const startHour = parseInt(start.split(':')[0]) + parseInt(start.split(':')[1]) / 60;
  const endHour = parseInt(end.split(':')[0]) + parseInt(end.split(':')[1]) / 60;
  return Math.max(0, endHour - startHour);
};

