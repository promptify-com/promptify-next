export function formatDate(input: Date | string) {
  const date = input instanceof Date ? input : new Date(input);

  return date.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}

export function formatDateTime(input: Date | string) {
  const date = input instanceof Date ? input : new Date(input);

  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(input: Date | string) {
  const date = input instanceof Date ? input : new Date(input);
  const formatter = new Intl.RelativeTimeFormat("en");
  const ranges: Record<string, number> = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  };
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;

  for (const key in ranges) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key];

      return formatter.format(Math.round(delta), key as Intl.RelativeTimeFormatUnit);
    }
  }

  return "some time ago";
}

export function daysFrom(from: Date | string, to: Date | string = "") {
  const toDate = to ? new Date(to) : new Date();
  return Math.round((toDate.getTime() - new Date(from).getTime()) / (1000 * 3600 * 24));
}

export function timeLeft(input: Date | string): string {
  const date = input instanceof Date ? input : new Date(input);

  const now = new Date();
  const timeLeft = date.getTime() - now.getTime();

  if (timeLeft < 0) {
    return "0";
  }

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(timeLeft / day);
  const hours = Math.floor((timeLeft % day) / hour);
  const minutes = Math.floor((timeLeft % hour) / minute);

  return days > 0
    ? `${days} ${days === 1 ? "day" : "days"}`
    : hours > 0
      ? `${hours} ${hours === 1 ? "hour" : "hours"}`
      : minutes > 0
        ? `${minutes} ${minutes === 1 ? "minute" : "minutes"}`
        : " couple of seconds";
}

export function getCurrentDateFormatted(): string {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return currentDate.toLocaleDateString("en-US", options);
}
