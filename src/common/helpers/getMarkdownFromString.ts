export const getMarkdownFromString = (str: string): string => {
  return str
    .replace(/###([^\n]+)\n/g, '<h3>$1</h3>\n')
    .replace(/##([^\n]+)\n/g, '<h2>$1</h2>\n')
    .replace(/#([^\n]+)\n/g, '<h1>$1</h1>\n')
    .replace(/- \*\*([^\*]*)\*\*/g, '<h4>$1</h4>')
    .replace(/\*\*([^\*]*)\*\*/g, '<h4>$1</h4>')
    .replace(/- ([^\n]+)\n/g, '<div>- $1</div>')
    .replace(/\n/g, '<br>')
    .replace('\"', '"');
};
