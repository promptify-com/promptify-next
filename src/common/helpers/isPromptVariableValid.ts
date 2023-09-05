export const isPromptVariableValid = (content: string): boolean => {
  const validTextRegex = /^[a-zA-Z]+$/;
  const regex = /{{(.*?)}}/g;
  const validTypes = ["text", "integer", "code", "choices"];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const parts = match[1].split(":");
    const variableName = parts[0];
    const type = parts[1];

    if (!validTextRegex.test(variableName)) {
      return false;
    }

    if (!validTypes.includes(type)) {
      return false;
    }

    if (parts[2] && parts[2] !== "true" && parts[2] !== "false") {
      return false;
    }

    if (type === "choices") {
      if (
        !(
          parts[3]?.startsWith('"') &&
          parts[3]?.endsWith('"') &&
          Array.from(new Set(parts[3].slice(1, -1).split(","))).every(option => option.trim())
        )
      ) {
        console.log("CHOICES ERROR");
        return false;
      }
    }
  }

  return true;
};
