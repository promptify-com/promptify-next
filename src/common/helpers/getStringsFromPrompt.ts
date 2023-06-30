interface IPrompts {
  title: string;
  text: string;
}

export const getStringsFromPrompt = (str: string) => {
  const matches: IPrompts[] = [];
  const regex = /{{(.*?)}}/g;
  let match;

  while ((match = regex.exec(str)) !== null) {
    const str = match[0];
    const arrayOfStrings = str.slice(2).slice(0, -2).split(':');

    const obj = {
      title: arrayOfStrings[0]
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .replace(/^./, arrayOfStrings[0][0].toUpperCase()),
      text: arrayOfStrings[1],
    };

    matches.push(obj);
  }
  return matches;
};
