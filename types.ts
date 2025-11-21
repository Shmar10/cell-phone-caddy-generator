export enum FillDirection {
  TOP_LEFT_FORWARD = 'Top Left → Forward',
  BOTTOM_RIGHT_BACKWARD = 'Bottom Right ← Backward',
}

export interface Student {
  original: string;
  formatted: string; // Last, First
}

export interface ClassRoster {
  id: string;
  filename: string;
  students: Student[];
  color: string; // Hex code for background
}

export interface GridConfig {
  rows: number;
  columns: number;
  fillDirection: FillDirection;
  docId: string;
}

export interface ProcessedCell {
  index: number; // 1-based index
  student: Student | null;
  row: number;
  col: number;
  isUsed: boolean;
}