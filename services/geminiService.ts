import { GoogleGenAI } from "@google/genai";
import { ClassRoster, GridConfig } from "../types";

export const generateGoogleAppsScript = async (
  config: GridConfig,
  rosters: ClassRoster[]
): Promise<string> => {
  // 1. Validate API Key
  if (!import.meta.env.VITE_API_KEY) { 
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

  // 2. Clean the Document ID
  let cleanDocId = config.docId.trim();
  const urlMatch = cleanDocId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) {
    cleanDocId = urlMatch[1]; 
  }

  const dataSummary = rosters.map(r => ({
    fileName: r.filename,
    color: r.color,
    students: r.students.map(s => s.formatted),
  }));

  const prompt = `
  You are an expert Google Apps Script developer.
   
  Task: Write a complete, standalone Google Apps Script function named 'createSeatingCharts'.

  Context:
  Target Doc ID: "${cleanDocId}"
   
  Configuration:
  - Grid Rows: ${config.rows}
  - Grid Columns: ${config.columns}
  - Fill Direction: "${config.fillDirection}"
   
  Data to Process (JSON):
  ${JSON.stringify(dataSummary, null, 2)}

  Requirements:
  1. Define 'const DOC_ID = "${cleanDocId}";' at the top.
  2. Open doc using 'DocumentApp.openById(DOC_ID)'.
  3. For each roster:
     a. Add Page Break (if not first).
     b. Add Heading 1 with roster name.
     c. Create a SQUARE CELL Table:
        - Get page width: 'var pageWidth = body.getPageWidth() - body.getMarginLeft() - body.getMarginRight();'
        - Calculate cell size: 'var cellSide = pageWidth / ${config.columns};'
        - Create table: 'var table = body.appendTable();'
        - Loop ${config.rows} times to add rows.
        - CRITICAL: Force square height: 'row.setMinimumHeight(cellSide)'.
        - Loop ${config.columns} times to add cells.
        - AFTER loops, force column widths: loop cols 0 to ${config.columns - 1}, 'table.setColumnWidth(i, cellSide)'.
     d. Fill student names based on fill direction logic.
     e. Styling (Use EXACTLY this logic to avoid errors):
        - Clear cell: 'cell.clear();'
        - Set vertical alignment: 'cell.setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER);'
        - Add Seat Number:
          'var p1 = cell.appendParagraph(seatNumber.toString());'
          'p1.setAlignment(DocumentApp.HorizontalAlignment.CENTER);'
          'p1.editAsText().setFontSize(9).setBold(false);'
        - Add Student Name (if exists):
          'var p2 = cell.appendParagraph(studentName);'
          'p2.setAlignment(DocumentApp.HorizontalAlignment.CENTER);'
          'p2.editAsText().setFontSize(11).setBold(true);'
          'cell.setBackgroundColor(item.color);'
        - Do NOT use 'getChild()', 'asCharacterStyle()', or 'setHorizontalAlignment()' on the cell itself.
  4. Add try/catch block for error logging.
  5. Output ONLY raw code.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", 
    contents: prompt,
  });

  let code = response.text || "// Error: No code generated.";
  code = code.replace(/```javascript/g, '').replace(/```/g, '');

  return code.trim();
};
