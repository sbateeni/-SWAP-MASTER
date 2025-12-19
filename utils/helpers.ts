
import { TileData } from '../types.ts';

/**
 * خوارزمية خلط قوية جداً تضمن أن القطع مشتتة تماماً
 */
export const shuffleTiles = (gridSize: number): TileData[] => {
  const count = gridSize * gridSize;
  let tiles: TileData[] = [];
  let isTooEasy = true;
  let attempts = 0;

  while (isTooEasy && attempts < 20) {
    const freshTiles: TileData[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      originalIndex: i,
      currentIndex: i,
    }));

    // خلط Fisher-Yates
    for (let i = freshTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [freshTiles[i], freshTiles[j]] = [freshTiles[j], freshTiles[i]];
    }

    // التحقق من أن عدد القطع الصحيحة قليل جداً
    const correctCount = freshTiles.filter((t, idx) => t.originalIndex === idx).length;
    
    // هدفنا: أقل من قطعتين في مكانهما الصحيح للشبكات الصغيرة، و 0 للشبكات الكبيرة
    const limit = gridSize <= 3 ? 1 : 0;
    
    if (correctCount <= limit || attempts >= 19) {
      tiles = freshTiles;
      isTooEasy = false;
    }
    attempts++;
  }

  return tiles.map((tile, idx) => ({ ...tile, currentIndex: idx }));
};

export const checkWin = (tiles: TileData[]): boolean => {
  return tiles.every((tile, idx) => tile.originalIndex === idx);
};

export const calculateStars = (moves: number, time: number, gridSize: number): number => {
  const baseMoves = gridSize * gridSize * 2;
  if (moves <= baseMoves && time < 45) return 3;
  if (moves <= baseMoves * 2 && time < 90) return 2;
  return 1;
};
