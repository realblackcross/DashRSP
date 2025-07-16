import Papa from 'papaparse';

/**
 * Parses a CSV file from the given file path using PapaParse.
 * 
 * @param filePath - The relative or absolute path to the CSV file
 * @returns A Promise resolving to an array of parsed data objects
 */
export async function parseCSV(filePath: string): Promise<any[]> {
  try {
    // Fetch the CSV file contents as plain text
    const response = await fetch(filePath);
    const text = await response.text();

    // Use PapaParse to convert CSV text into structured data
    const parsed = Papa.parse(text, {
      header: true,          // First row will be treated as headers
      skipEmptyLines: true,  // Ignore blank rows
    });

    // Return the parsed array of objects (each row is one object)
    return parsed.data as any[];
  } catch (error) {
    // If any error occurs (e.g., file not found or invalid CSV), log it
    console.error('CSV Parse Error:', error);
    return []; // Return empty array on failure to prevent app crash
  }
}
