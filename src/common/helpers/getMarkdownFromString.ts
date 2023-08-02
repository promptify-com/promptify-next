export const getMarkdownFromString = (markdown: string): string => {

  return markdown
    .replace(/^###([^\n]+)\n/gm, '<h3>$1</h3>\n')
    .replace(/^##([^\n]+)\n/gm, '<h2>$1</h2>\n')
    .replace(/^#([^\n]+)\n/gm, '<h1>$1</h1>\n')
    .replace(/- \*\*([^\*]*)\*\*/g, '<h4>$1</h4>')
    .replace(/\*\*([^\*]*)\*\*/g, '<h4>$1</h4>')
    .replace(/- ([^\n]+)\n/g, '<div>- $1</div>')
    .replace(/\n/g, '<br>')
    .replace('\"', '"');
};

export const highlightSearch = (searchString: string, searchValue: string): string => {
  if (!searchValue) {
    return searchString;
  }
  
  return searchString.replace(new RegExp(searchValue, 'gi'), '<span class="highlight">$&</span>');
}