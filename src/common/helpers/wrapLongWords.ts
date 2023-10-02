export function wrapLongWords(text: string, maxLength: number) {
  const words = text.split(" ");
  const wrappedWords = [];

  for (const word of words) {
    if (word.length > maxLength) {
      let wrappedWord = "";
      for (let i = 0; i < word.length; i += maxLength) {
        wrappedWord += word.substring(i, i + maxLength) + "-";
      }
      wrappedWords.push(wrappedWord.trim());
    } else {
      wrappedWords.push(word);
    }
  }

  return wrappedWords.join(" ");
}
