import { GoogleGenAI } from "@google/genai";
import { ClassRoster, GridConfig } from "../types";

export const generateGoogleAppsScript = async (
  config: GridConfig,
  rosters: ClassRoster[]
): Promise<string> => {
  if (!import.meta.env.VITE_API_KEY) { 
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

  const dataSummary = rosters.map(r => ({
    fileName: r.filename,
    color: r.color,
    students: r.students.map(s => s.formatted),
  }));

  const prompt = `
  You are an expert Google Apps Script developer.
  
  Task: Write a complete, standalone Google Apps Script function named 'createSeatingCharts' that a user can copy and paste into the Apps Script editor bound to a Google Doc.

  Context:
  The user wants to generate seating chart tables in a specific Google Doc.
  Target Doc ID: "${config.docId}"
  
  Configuration:
  - Grid Rows: ${config.rows}
  - Grid Columns: ${config.columns}
  - Fill Direction: "${config.fillDirection}"
  
  Data to Process (JSON):
  ${JSON.stringify(dataSummary, null, 2)}

  Requirements for the Script:
  1. Open the Document by ID.
  2. For each item in the data:
     a. Append a Page Break (except for the very first one if the doc is empty, but usually appending a page break first is safer to separate classes).
     b. Append a Paragraph with the 'fileName' as a Heading 1 title.
     c. Append a Table with ${config.rows} rows and ${config.columns} columns.
     d. Iterate through the cells to fill in student names.
        - If Fill Direction is 'Top Left → Forward': Start at (0,0), go row by row, col by col.
        - If Fill Direction is 'Bottom Right ← Backward': Start at the last cell (row ${config.rows-1}, column ${config.columns-1}) and fill cells in reverse order (moving left along the row, then up to the end of the previous row).
     e. In each cell:
        - Add the number of the seat (1 to N) on a new line or before the name. Note: Seat 1 is always Top-Left, Seat N is Bottom-Right. The student assignment logic (step d) determines WHICH student goes into which seat, but the seat numbers themselves should remain static (1..N) for reference.
        - If a student is assigned to that seat based on the fill logic, add their name (Bold text).
        - If a student is assigned, set the cell background color to the hex color provided in the data.
        - If no student is assigned but the cell exists in the grid (overflow), leave it empty but numbered.
     f. Set the column widths to be equal distributed if possible.
  3. Include error handling (try/catch) and logging.
  4. The output must be ONLY the raw code, no markdown backticks, no explanation text.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // Using flash for speed and logic capability
    contents: prompt,
  });

  let code = response.text || "// Error: No code generated.";
  
  // Cleanup markdown if present
  code = code.replace(/```javascript/g, '').replace(/```/g, '');

  return code.trim();
};
