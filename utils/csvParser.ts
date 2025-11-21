import { Student } from '../types';

/**
 * Helper to Title Case a string (e.g. "john" -> "John")
 */
const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * Formats a name string into "LAST, FIRST"
 */
const formatName = (rawName: string): string => {
  const name = rawName.trim();
  if (!name) return '';

  // Check if already in "Last, First" format
  if (name.includes(',')) {
    const parts = name.split(',');
    if (parts.length >= 2) {
      const last = parts[0].trim().toUpperCase();
      const first = toTitleCase(parts[1].trim());
      return `${last}, ${first}`;
    }
    return name.toUpperCase();
  }

  // Assume "First Last" format
  const parts = name.split(/\s+/);
  if (parts.length === 1) return parts[0].toUpperCase();

  const last = parts.pop()?.toUpperCase();
  const first = toTitleCase(parts.join(' '));
  return `${last}, ${first}`;
};

/**
 * Parses CSV content into a list of students
 */
export const parseCSV = (content: string): Student[] => {
  const lines = content.split(/\r?\n/);
  const students: Student[] = [];

  for (const line of lines) {
    const cleanLine = line.trim();
    // Skip empty lines or headers that look like "Name" or "Student"
    if (!cleanLine) continue;
    if (['name', 'student', 'student name'].includes(cleanLine.toLowerCase())) continue;

    // Simple handling: assume the first non-empty column is the name
    // If there are commas in the CSV structure itself (not the name), we take the first token.
    // However, many rosters are just a list of names. 
    // Let's try to treat the whole line as the name if it doesn't look like complex data,
    // otherwise take the first cell.
    
    let rawName = cleanLine;
    // If it looks like a standard CSV row "id,name,grade", try to split
    // This is a heuristic. For this app, we assume simple lists or we take the first column.
    if (cleanLine.includes(',') && !cleanLine.includes('"')) {
       // If line has commas, checks if it might be "Last, First" (2 parts) or columns
       // "Doe, John" -> Keep as is.
       // "123, John Doe" -> Split.
       const parts = cleanLine.split(',');
       // Heuristic: if the second part starts with a space, it might be "Last, First"
       if (parts.length > 1 && !parts[1].startsWith(' ')) {
         // Likely columns
         rawName = parts[0] || parts[1]; // Fallback
       }
    }
    
    // Remove quotes if present
    rawName = rawName.replace(/^"|"$/g, '');

    if (rawName) {
        students.push({
            original: cleanLine,
            formatted: formatName(rawName)
        });
    }
  }

  return students;
};