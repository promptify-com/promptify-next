import { timeLeft } from "@/common/helpers/timeManipulation";

const EXECUTION_LIFETIME_DAYS = 30;

export const calculateDocumentDeleteDeadline = (createdAt: string | Date) => {
  const deleteDeadline = new Date(new Date(createdAt).setDate(new Date(createdAt).getDate() + EXECUTION_LIFETIME_DAYS));
  return timeLeft(deleteDeadline);
};
