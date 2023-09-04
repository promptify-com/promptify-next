export const isPromptVariableValid = (content: string): boolean => {
  const validTextRegex = /^[a-zA-Z]+$/;
  const regex = /{{(.*?)}}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const parts = match[1].split(":");
    const variableName = parts[0];

    if (!validTextRegex.test(variableName)) {
      return false;
    }
  }
  return true;
};
