export interface Student {
  formatted: string; // "Last, First" or just "Name"
  raw: any;
}

export interface ClassRoster {
  id: string;
  filename: string;
  students: Student[];
  color: string;
}

export type FillDirection = 'Top Left → Forward' | 'Bottom Right ← Backward';
export type Theme = 'Standard' | 'Pastel' | 'High Contrast' | 'Black & White';
export type OverflowBehavior = 'New Page' | 'Waiting List';

export interface GridConfig {
  docId: string;
  rows: number;
  columns: number;
  fillDirection: FillDirection;
  // New Features
  skipSeats: string;       // "13, 44"
  randomize: boolean;      // true/false
  theme: Theme;            // Color palette
  landscape: boolean;      // Page orientation
  overflow: OverflowBehavior; // How to handle extra students
}
