export function parseMessageData(data: string): any {
  // Replace single quotes with double quotes
  data = data.replace(/'/g, '"');

  // Handle triple double quotes
  data = data.replace(/"""/g, '"\\""');

  // Correctly escape double quotes inside message property value
  data = data.replace(/"message": "(.*?)",/g, (match, p1) => {
    return `"message": "${p1.split('\\"').join('"').replace(/"/g, '\\"')}",`;
  });

  // Revert 'word-ending contractions' to their original form
  data = data.replace(/"\\"([a-z]{1,2})"/gi, '"\'$1"');

  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse data:", data, error);
    throw error;
  }

  return parsedData;
}
