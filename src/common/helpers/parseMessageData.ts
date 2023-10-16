export function parseMessageData(data: string): any {
  // Convert single quotes to double quotes
  data = data.replace(/(\W)'|'(\W)/g, '$1"$2');

  // Handle cases like ""t", ""s", ""re", etc.
  data = data.replace(/""([a-z]{1,2})"/gi, '"\\"$1"');

  // Handle the space after the double quote
  data = data.replace(/" "/g, '"\\" "');

  // Handle triple double quotes
  data = data.replace(/"""/g, '"\\""');

  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse data:", data, error);
    throw error; // re-throw the error to be handled by the caller
  }

  return parsedData;
}
