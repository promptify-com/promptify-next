const getType = (str: string) => {
  switch (str) {
    case 'integer':
      return 'number';
    default:
      return 'text';
  }
};

export const getArrayFromString = (str: string) => {
  const regex = /{{(.*?)}}/g;
  const matches = [];
  let match;

  while ((match = regex.exec(str)) !== null) {
    const str = match[1];
    const obj = {
      name: str.slice(0, str.indexOf(':')),
      fullName: str
        .slice(0, str.indexOf(':'))
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .replace(/^./, str[0].toUpperCase()),
      type: getType(str.slice(str.indexOf(':') + 1)),
    };

    matches.push(obj);
  }

  return matches;
};
