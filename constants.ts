import { FillDirection } from './types';

export const DEFAULT_ROWS = 5;
export const DEFAULT_COLS = 6;

export const PASTEL_COLORS = [
  '#fee2e2', // Red-100
  '#ffedd5', // Orange-100
  '#fef3c7', // Amber-100
  '#dcfce7', // Green-100
  '#ccfbf1', // Teal-100
  '#dbeafe', // Blue-100
  '#e0e7ff', // Indigo-100
  '#f3e8ff', // Purple-100
  '#fae8ff', // Fuchsia-100
  '#ffe4e6', // Rose-100
];

export const INITIAL_CONFIG = {
  rows: DEFAULT_ROWS,
  columns: DEFAULT_COLS,
  fillDirection: FillDirection.TOP_LEFT_FORWARD,
  docId: '',
};