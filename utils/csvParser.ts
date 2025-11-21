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
      // If there are multiple commas (e.g. "Doe, Jr., John"), we assume standard "Last, First"
      // where everything before the last comma might be the last name, or standard parsing.
      // For simple robustness:
      const last = parts[0].trim().toUpperCase();
      const first = toTitleCase(parts.slice(1).join(' ').trim());
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
  // Filter empty lines
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  const students: Student[] = [];
  const seenNames = new Set<string>();

  if (lines.length === 0) return [];

  // 1. Detect Headers
  const headerLine = lines[0];
  // Regex to split by comma but ignore commas inside quotes
  const headers = headerLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
    .map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

  let firstNameIdx = -1;
  let lastNameIdx = -1;
  let nameIdx = -1;

  headers.forEach((h, i) => {
    const clean = h.replace(/[^a-z0-9]/g, '');
    if (['firstname', 'first'].includes(clean)) firstNameIdx = i;
    if (['lastname', 'last'].includes(clean)) lastNameIdx = i;
    if (['name', 'student', 'studentname', 'displayname'].includes(clean)) nameIdx = i;
  });

  const hasSpecificHeaders = (firstNameIdx !== -1 && lastNameIdx !== -1);
  const hasNameHeader = nameIdx !== -1;
  
  // Determine where data starts
  // If we found headers, start at index 1.
  // If we didn't find specific headers but the first line has "name" related text, skip it.
  let startRow = 0;
  if (hasSpecificHeaders || hasNameHeader || headerLine.toLowerCase().includes('name')) {
    startRow = 1;
  }

  for (let i = startRow; i < lines.length; i++) {
    const line = lines[i];
    // Split line by comma, respecting quotes
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map(p => p.trim().replace(/^"|"$/g, ''));

    let formatted = '';

    if (hasSpecificHeaders && parts[firstNameIdx] && parts[lastNameIdx]) {
        // We have explicit columns for First and Last Name
        const last = parts[lastNameIdx].trim().toUpperCase();
        const first = toTitleCase(parts[firstNameIdx].trim());
        formatted = `${last}, ${first}`;
    } else {
        // Fallback logic
        let rawName = '';
        if (hasNameHeader && parts[nameIdx]) {
            rawName = parts[nameIdx];
        } else {
            // Heuristic for headerless files
            // If it looks like an ID is in col 0, use col 1
            if (parts.length > 1 && parts[0].match(/^\d+$/)) {
                rawName = parts[1];
            } else if (parts.length > 1) {
                 // Default to first text-like column.
                 rawName = parts[0]; 
            } else {
                 rawName = parts[0];
            }
        }
        
        if (!rawName) continue;
        formatted = formatName(rawName);
    }

    if (!formatted || !formatted.replace(/[^a-zA-Z]/g, '')) continue; // Skip empty or non-text

    if (!seenNames.has(formatted)) {
        seenNames.add(formatted);
        students.push({
            original: line,
            formatted: formatted
        });
    }
  }

  return students;
};
