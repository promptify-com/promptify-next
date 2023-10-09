import { IPromptInput, InputType } from "../types/prompt";

// TODO: Prompt input number should fixed either "integer" or "number"
const getType = (str: string): InputType => {
  switch (str) {
    case "integer":
    case "number":
      return "number";
    case "code":
      return "code";
    case "choices":
      return "choices";
    default:
      return "text";
  }
};

// TODO: getInputsFromString should return inputs filtered by name
export const getInputsFromString = (str: string): IPromptInput[] => {
  const regex = /{{(.*?)}}/g;
  const matches = [];
  let match;

  while ((match = regex.exec(str)) !== null) {
    const parts = match[1].split(":");
    const type = getType(parts[1]);
    const choices =
      type === "choices" && parts[3]?.startsWith('"') && parts[3]?.endsWith('"') // options format: "option1,option2"
        ? Array.from(new Set(parts[3].slice(1, -1).split(","))).filter(option => option.trim()) // duplicates & empty options removed
        : null;

    if (type === "choices" && !choices?.length) {
      continue;
    }

    const obj = {
      name: parts[0],
      fullName: parts[0]
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .toLowerCase()
        .replace(/^./, parts[0][0].toUpperCase()),
      type: type,
      required: parts[2] ? parts[2].toLowerCase() !== "false" : true, // required by default
      choices: choices,
    };

    matches.push(obj);
  }

  return matches;
};
