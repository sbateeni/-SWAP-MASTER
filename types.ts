
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT',
  MASTER = 'MASTER',
  LEGENDARY = 'LEGENDARY'
}

export interface LevelConfig {
  id: number;
  difficulty: Difficulty;
  gridSize: number;
  image: string;
  showNumbers: boolean;
  timeLimit?: number;
  moveLimit?: number;
}

export interface TileData {
  id: number;
  originalIndex: number;
  currentIndex: number;
}

export type View = 'menu' | 'levels' | 'playing';

export interface GameState {
  currentLevelIdx: number;
  tiles: TileData[];
  moves: number;
  time: number;
  isWon: boolean;
  status: 'playing' | 'paused' | 'won' | 'lost';
  view: View;
  unlockedLevels: number[]; // Array of completed level indices
}
