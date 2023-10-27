import { BuilderInputTypes } from "@/common/constants";
import { InputType } from "@/common/types/prompt";

export const isPromptVariableValid = (content: string) => {
  const validTextRegex = /^[a-zA-Z]+$/;
  const regex = /{{(.*?)}}/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const parts = match[1].split(":");
    const variableName = parts[0];
    const type = parts[1] as InputType;

    if (!validTextRegex.test(variableName)) {
      return {
        isValid: false,
        message: `"${match[0]}"`,
      };
    }

    if (type && !BuilderInputTypes.includes(type)) {
      return {
        isValid: false,
        message: `"${match[0]}"`,
      };
    }

    if (parts[2] && parts[2] !== "true" && parts[2] !== "false") {
      return {
        isValid: false,
        message: `"${match[0]}"`,
      };
    }

    if (type === "choices") {
      if (!parts[3]?.split(",").every(option => option.trim())) {
        return {
          isValid: false,
          message: `"${match[0]}"`,
        };
      }
    }

    if (type === "file") {
      const extensions = (parts[3]?.split(",") || []).map(ext => ext.trim());
      const validExtensions = ["pdf", "docx", "txt"];

      if (extensions.length === 0 || extensions.length > 3 || extensions.some(ext => !validExtensions.includes(ext))) {
        return {
          isValid: false,
          message: `"${match[0]}"`,
        };
      }
    }
  }

  return {
    isValid: true,
    message: "",
  };
};

export const validatePromptOutput = (value: string) => {
  value = value.replace(/\s/g, "");

  if (value.length && value[0] !== "$") {
    return "$" + value;
  }
  return value;
};
