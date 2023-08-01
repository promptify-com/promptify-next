export const getMarkdownFromString = (str: string, search=""): string => {

  let formatted = str
    .replace(/^###([^\n]+)\n/gm, '<h3>$1</h3>\n')
    .replace(/^##([^\n]+)\n/gm, '<h2>$1</h2>\n')
    .replace(/^#([^\n]+)\n/gm, '<h1>$1</h1>\n')
    .replace(/- \*\*([^\*]*)\*\*/g, '<h4>$1</h4>')
    .replace(/\*\*([^\*]*)\*\*/g, '<h4>$1</h4>')
    .replace(/- ([^\n]+)\n/g, '<div>- $1</div>')
    .replace(/\n/g, '<br>')
    .replace('\"', '"');

  if (search) {
    formatted = formatted.replace(new RegExp(search, 'gi'), '<span class="highlight">$&</span>');
  }

  return formatted;
};