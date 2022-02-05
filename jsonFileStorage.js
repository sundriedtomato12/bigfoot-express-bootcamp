import { readFile } from 'fs';

/**
 * Add a JS Object to an array of Objects in a JSON file
 * @param {string} filename - Name of JSON file
 * @param {function} callback - The callback function to execute on error or success
 * Callback takes read error as 1st param and JS Object as 2nd param.
 * @returns undefined
 */
export default function read(filename, callback) {
  const handleFileRead = (readErr, jsonContentStr) => {
    if (readErr) {
      console.error('Read error', readErr);
      // Allow client to handle error in their own way
      callback(readErr, null);
      return;
    }

    // Convert file content to JS Object
    const jsonContentObj = JSON.parse(jsonContentStr);

    // Call client callback on file content
    callback(null, jsonContentObj);
  };

  // Read content from DB
  readFile(filename, 'utf-8', handleFileRead);
}
