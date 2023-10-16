export function parseMessageData(data: string): any {
  // Capture all 'word-ending contractions' to revert them later
  const contractions = [];
  const contractionRegex = /(\w)"/g;
  let match;
  while ((match = contractionRegex.exec(data)) !== null) {
    contractions.push(match[1] + '"');
  }

  // Convert single quotes to double quotes only when they are outside of double quotes
  const outsideOfDoubleQuotes = /'(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
  data = data.replace(outsideOfDoubleQuotes, '"');

  // Handle double quotes that precede newlines
  data = data.replace(/\\"\\n/g, '\\\\"\\n');

  // Handle cases like ""t", ""s", ""re", etc.
  data = data.replace(/""([a-z]{1,2})"/gi, '"\\"$1"');

  // Handle the space after the double quote
  data = data.replace(/" "/g, '"\\" "');

  // Handle triple double quotes
  data = data.replace(/"""/g, '"\\""');

  // Correctly escape double quotes inside message property value
  data = data.replace(/"message": "(.*?)",/g, (match, p1) => {
    // Ensure we're not over-escaping already correctly formatted strings
    return `"message": "${p1.split('\\"').join('"').replace(/"/g, '\\"')}",`;
  });

  // Revert 'word-ending contractions' to their original form
  data = data.replace(/"\\"([a-z]{1,2})"/gi, '"\'$1"');
  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse data:", data, error);
    throw error; // re-throw the error to be handled by the caller
  }

  return parsedData;
}
