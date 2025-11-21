import { GridConfig } from './types';

export const INITIAL_CONFIG: GridConfig = {
  docId: '',
  rows: 6,
  columns: 5,
  fillDirection: 'Top Left → Forward',
  // New Defaults
  skipSeats: '',
  randomize: false,
  theme: 'Standard',
  landscape: false,
  overflow: 'New Page',
};
