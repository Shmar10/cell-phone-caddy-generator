import { GoogleGenAI } from "@google/genai";
import { ClassRoster, GridConfig } from "../types";

export const generateGoogleAppsScript = async (
  config: GridConfig,
  rosters: ClassRoster[]
): Promise<string> => {
  // Ensure we use the Vite-compatible environment variable
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
  1. Define the constant DOC_ID = "${config.docId}" at the top of the function.
  2. Open the Document by ID using 'DocumentApp.openById(DOC_ID)'.
  3. For each item in the data:
     a. Append a Page Break (except for the very first one if the doc is empty, but usually appending a page break first is safer to separate classes).
     b. Append a Paragraph with the 'fileName' as a Heading 1 title.
     c. Create the Grid/Table with SQUARE cells:
        - Calculate the available page width in points: 'var pageWidth = body.getPageWidth() - body.getMarginLeft() - body.getMarginRight();'
        - Calculate the cell side length: 'var cellSide = pageWidth / ${config.columns};'
        - Append an empty table: 'var table = body.appendTable();'
        - Iterate ${config.rows} times to append rows using 'var row = table.appendTableRow()'.
        - CRITICAL: Set the row height to make it square: 'row.setMinimumHeight(cellSide)'.
        - Inside each row, iterate ${config.columns} times to append cells using 'row.appendTableCell()'.
        - After building the table, loop through columns 0 to ${config.columns - 1} and set their width: 'table.setColumnWidth(colIndex, cellSide)'.
     d. Iterate through the cells to fill in student names.
        - If Fill Direction is 'Top Left → Forward': Start at (0,0), go row by row, col by col.
        - If Fill Direction is 'Bottom Right ← Backward': Start at the last cell (row ${config.rows-1}, column ${config.columns-1}) and fill cells in reverse order.
     e. In each cell:
        - Add the number of the seat (1 to N) on a new line or before the name. Note: Seat 1 is always Top-Left, Seat N is Bottom-Right. 
        - If a student is assigned to that seat based on the fill logic, add their name (Bold text).
        - If a student is assigned, set the cell background color to the hex color provided in the data.
        - If no student is assigned but the cell exists in the grid (overflow), leave it empty but numbered.
  4. Include error handling (try/catch) and logging.
  5. The output must be ONLY the raw code, no markdown backticks, no explanation text.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", 
    contents: prompt,
  });

  let code = response.text || "// Error: No code generated.";
   
  // Cleanup markdown if present
  code = code.replace(/```javascript/g, '').replace(/```/g, '');

  return code.trim();
};
