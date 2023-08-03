export const highlightSearch = (searchString: string, searchValue: string): string => {
  if (!searchValue) {
    return searchString;
  }
  
  return searchString.replace(new RegExp(searchValue, 'gi'), '<span class="highlight">$&</span>');
}