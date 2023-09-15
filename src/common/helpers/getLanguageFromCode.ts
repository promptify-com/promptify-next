export const getLanguageFromCode = (code: string) => {
  switch (code) {
    case "es":
      return "Spanish";
    case "fr":
      return "French";
    default:
      return "English";
  }
};
