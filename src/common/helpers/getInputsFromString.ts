import { IPromptInput } from "../types/prompt";

const getType = (str: string) => {
  switch (str) {
    case "integer":
      return "number";
    case "code":
      return "code";
    default:
      return "text";
  }
};

export const getInputsFromString = (str: string): IPromptInput[] => {
  const regex = /{{(.*?)}}/g;
  const matches = [];
  let match;

  while ((match = regex.exec(str)) !== null) {
    const parts = match[1].split(":");

    const obj = {
      name: parts[0],
      fullName: parts[0]
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .toLowerCase()
        .replace(/^./, parts[0][0].toUpperCase()),
      type: getType(parts[1]),
      required: parts[2] ? parts[2].toLowerCase() !== "false" : true, // required by default
    };

    matches.push(obj);
  }

  return matches;
};
