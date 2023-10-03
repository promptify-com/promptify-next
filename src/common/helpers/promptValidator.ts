export const isPromptVariableValid = (content: string) => {
  const validTextRegex = /^[a-zA-Z]+$/;
  const regex = /{{(.*?)}}/g;
  const validTypes = ["text", "number", "integer", "code", "choices", "file"];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const parts = match[1].split(":");
    const variableName = parts[0];
    const type = parts[1];

    if (!validTextRegex.test(variableName)) {
      return {
        isValid: false,
        message: `"${match[0]}"`,
      };
    }

    if (type && !validTypes.includes(type)) {
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
      if (
        !(
          parts[3]?.startsWith('"') &&
          parts[3]?.endsWith('"') &&
          Array.from(new Set(parts[3].slice(1, -1).split(","))).every(option => option.trim())
        )
      ) {
        return {
          isValid: false,
          message: `"${match[0]}"`,
        };
      }
    }

    if (type === "file") {
      const extensions = parts[3]?.split(",");
      const validExtensions = ["pdf", "docx", "txt"];
      const validExtensionCount = extensions.filter(ext => validExtensions.includes(ext.trim())).length;
      const invalidExtensions = extensions.filter(ext => !validExtensions.includes(ext.trim())).length;

      if (validExtensionCount <= 0 || invalidExtensions > 0 || extensions.length > 3) {
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
