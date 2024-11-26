import { IAnswer } from "@/components/Prompt/Types/chat";
import { IPromptInput } from "@/common/types/prompt";
import { IMessage } from "@/components/Automation/ChatInterface/types";
import { IApp } from "@/components/Automation/app/hooks/types";

import { format, getDate, parseISO } from "date-fns";
import { PromptInputType } from "@/components/Prompt/Types";

export const randomId = () => Math.floor(Math.random() * 1000000000);

export const createMessage = ({
  type,
  timestamp = new Date().toISOString(),
  fromUser = false,
  noHeader = false,
  isHighlight = false,
  isRequired = false,
  questionIndex,
  text = "",
  data,
  choices,
}: IMessage) => ({
  id: randomId(),
  text,
  type,
  createdAt: timestamp,
  fromUser,
  noHeader,
  isHighlight,
  isRequired,
  questionIndex,
  data,
  choices,
});

export function allRequiredInputsAnswered(inputs: IPromptInput[], answers: IAnswer[]): boolean {
  const requiredQuestionNames = inputs.filter(question => question.required).map(question => question.name);

  if (!requiredQuestionNames.length) {
    return true;
  }

  const answeredQuestionNamesSet = new Set(answers.map(answer => answer.inputName));

  return requiredQuestionNames.every(name => answeredQuestionNamesSet.has(name));
}

export const getWorkflowInputsValues = (workflow: IApp) => {
  let values: IAnswer[] = [];

  const kwargs = workflow.periodic_task?.kwargs;
  if (kwargs) {
    const parsedKwargs = JSON.parse(kwargs || "{}");
    const workflowData = parsedKwargs.workflow_data || {};

    values = Object.entries(workflowData).map(([inputName, answer]) => ({
      inputName,
      required: true,
      question: ``,
      answer: answer as PromptInputType,
      prompt: 0,
    }));
  }

  return values;
};

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
