export const useScrollToElement = (behavior: "auto" | "smooth" = "auto") => {
  const scrollTo = (querySelector: string) => {
    const element = document.querySelector(querySelector);
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + element.clientHeight / 2;
      window.scrollTo({ top: y, behavior });
    }
  };

  return scrollTo;
};
