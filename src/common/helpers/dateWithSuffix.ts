import { format, getDate, parseISO } from "date-fns";

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatDateWithOrdinal = (date: string) => {
  const parsedDate = parseISO(date);

  const day = getDate(parsedDate);
  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

  const month = format(date, "MMMM");
  const year = format(date, "yyyy");

  return `${month} ${dayWithSuffix}, ${year}`;
};
