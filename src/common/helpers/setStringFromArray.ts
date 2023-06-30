export interface ISetStringFromArray {
  bookAbout?: string;
  bookName?: string;
  character?: string;
}

export const setStringFromArray = (str: string, obj: ISetStringFromArray) => {
  const temp: string[] = [];
  const words = str.split(' ');

  words.map(word => {
    if (word.slice(-1) !== '}') {
      temp.push(word);
    } else {
      if (word.includes('mainCharacterName') && obj.character) {
        temp.push(obj.character);
      }
      if (word.includes('mainTopic') && obj.bookAbout) {
        temp.push(obj.bookAbout);
      }
      // TODO: get bookName right naming
      if (word.includes('bookName???') && obj.bookName) {
        temp.push(obj.bookName);
      }
    }
  });

  return temp.join(' ');
};
