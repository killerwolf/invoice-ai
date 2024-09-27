export function parseMarkdownJson(markdownJson: string): object {
  // Remove the markdown block formatting
  const jsonString = markdownJson
    .replace(/```json/,'')
    .replace(/```/,'')
    .trim();

  // Parse the JSON string into an object
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Invalid JSON format');
  }
}