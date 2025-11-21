export interface Student {
  formatted: string;
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
  skipSeats: string;
  randomize: boolean;
  theme: Theme;
  landscape: boolean;
  overflow: OverflowBehavior;
}
