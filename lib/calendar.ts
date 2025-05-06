import { addDays, eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns';

export const getMonthMatrix = (d: Date) => {
  const start = startOfMonth(d);
  const end   = endOfMonth(d);
  return eachDayOfInterval({ start, end });
};

export const getWeek = (d: Date) => {
  const start = d.getDay() === 0 ? d : addDays(d, -d.getDay());
  return eachDayOfInterval({ start, end: addDays(start, 6) });
};
