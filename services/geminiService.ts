import { GoogleGenAI } from "@google/genai";
import { ClassRoster, GridConfig, Theme } from "../types";

const getThemeColor = (theme: Theme, index: number): string => {
    const palettes: Record<Theme, string[]> = {
        'Standard': ['#fee2e2', '#ffedd5', '#fef9c3', '#dcfce7', '#dbeafe', '#f3e8ff'],
        'Pastel': ['#ffb5a7', '#fcd5ce', '#f8edeb', '#f9dcc4', '#fec89a', '#e8e8e4'],
        'High Contrast': ['#ffff00', '#00ffff', '#ff00ff', '#00ff00', '#ff9900', '#00ccff'],
        'Black & White': ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']
    };
    const palette = palettes[theme] || palettes['Standard'];
    return palette[index % palette.length];
};

export const generateGoogleAppsScript = async (
  config: GridConfig,
  rosters: ClassRoster[]
): Promise<string> => {
  if (!import.meta.env.VITE_API_KEY) { 
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

  let cleanDocId = config.docId.trim();
  const urlMatch = cleanDocId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) {
    cleanDocId = urlMatch[1]; 
  }

  // 1. Handle Randomization (Feature 2)
  let processedRosters = [...rosters];
  if (config.randomize) {
      processedRosters = processedRosters.map(r => ({
          ...r,
          students: [...r.students].sort(() => Math.random() - 0.5)
      }));
  }

  // 2. Prepare Data with Themes (Feature 3)
  const dataSummary = processedRosters.map((r, idx) => ({
    fileName: r.filename,
    color: getThemeColor(config.theme, idx),
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
  - Page Orientation: ${config.landscape ? "LANDSCAPE" : "PORTRAIT"} (Feature 5)
  - Skip Seats: "${config.skipSeats}" (Feature 1)
  - Overflow Behavior: "${config.overflow}" (Feature 6)
   
  Data to Process (JSON):
  ${JSON.stringify(dataSummary, null, 2)}

  Requirements:
  1. Define 'const DOC_ID = "${cleanDocId}";' at the top.
  2. Open doc using 'DocumentApp.openById(DOC_ID)'.
  3. For each roster:
     a. Add Page Break (if not first).
     b. Feature 5: If Page Orientation is LANDSCAPE, set page attributes:
        'var body = doc.getBody();'
        'body.setPageHeight(595.0).setPageWidth(841.0);' // A4 Landscape standard
     c. Add Heading 1 with roster name.
     d. Create a SQUARE CELL Table:
        - Get page width: 'var pageWidth = body.getPageWidth() - body.getMarginLeft() - body.getMarginRight();'
        - Calculate cell size: 'var cellSide = pageWidth / ${config.columns};'
        - Create table: 'var table = body.appendTable();'
        - Loop ${config.rows} times to add rows.
        - Force square height: 'row.setMinimumHeight(cellSide)'.
        - Loop ${config.columns} times to add cells.
        - AFTER loops, force column widths: loop cols 0 to ${config.columns - 1}, 'table.setColumnWidth(i, cellSide)'.
     
     e. Feature 1 & 6 Logic (Student Assignment):
        - Parse "Skip Seats" string ("${config.skipSeats}") into an array of numbers.
        - Create a flat list of available seats (1 to ${config.rows * config.columns}).
        - Filter out any seat number that is in the Skip List.
        - Assign students to the remaining valid seats sequentially.
        - If Overflow Behavior is "New Page" and students remain: Create a new table on a new page for them.
        - If Overflow Behavior is "Waiting List" and students remain: Append a text paragraph "Waiting List: [Names]" below the table.

     f. Render Content:
        - Iterate rows 'r' and cols 'c'.
        - Calculate absolute Seat Number = (r * ${config.columns}) + c + 1.
        - If Seat Number is in Skip List: Mark cell with "X" or "Broken" (small grey text) and set background to light grey (#f3f4f6).
        - Else: Check if a student is assigned to this seat.
          - Use 'cell.getChild(0).asParagraph()' for seat number.
          - Use 'cell.appendParagraph(studentName)' for name.
          - Styling: Center align (Paragraph alignment), Bold name, Background color.
          - Vertical align middle: 'cell.setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER)'.
          - CRITICAL FIX: Do NOT use 'cell.setHorizontalAlignment'. Use 'paragraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER)' on the child paragraphs.
          
  4. Add try/catch block.
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
