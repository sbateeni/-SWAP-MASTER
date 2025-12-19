
import { TileData } from '../types';

export const shuffleTiles = (gridSize: number): TileData[] => {
  const count = gridSize * gridSize;
  const tiles: TileData[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    originalIndex: i,
    currentIndex: i,
  }));

  // Fisher-Yates Shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // Update current indices after shuffle
  return tiles.map((tile, idx) => ({ ...tile, currentIndex: idx }));
};

export const checkWin = (tiles: TileData[]): boolean => {
  return tiles.every((tile, idx) => tile.originalIndex === idx);
};

export const calculateStars = (moves: number, time: number, gridSize: number): number => {
  const baseMoves = gridSize * gridSize * 2.5;
  if (moves <= baseMoves && time < 60) return 3;
  if (moves <= baseMoves * 1.5 && time < 120) return 2;
  return 1;
};
