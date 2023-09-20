export function addSpaceBetweenCapitalized(text: string) {
  return text.replace(/([a-z])([A-Z])/g, "$1 $2");
}
