import moment from "moment";

export const executionTimeLeft = (createdAt: Date) => {
  const expireAt = moment(createdAt).add(30, "days");
  const duration = moment.duration(expireAt.diff(moment()));

  const daysLeft = duration.days();
  const hoursLeft = duration.hours();

  return daysLeft > 0
    ? `${daysLeft} ${daysLeft === 1 ? "day" : "days"}`
    : `${hoursLeft} ${hoursLeft === 1 ? "hour" : "hours"}`;
};
