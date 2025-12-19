
import { TileData } from '../types.ts';

/**
 * خوارزمية خلط مطورة تضمن عدم وجود قطع كثيرة في مكانها الصحيح
 */
export const shuffleTiles = (gridSize: number): TileData[] => {
  const count = gridSize * gridSize;
  let tiles: TileData[] = [];
  let isTooEasy = true;
  let attempts = 0;

  // نحاول الخلط حتى نضمن أن القطع مشتتة بما فيه الكفاية (بحد أقصى 10 محاولات لضمان الأداء)
  while (isTooEasy && attempts < 10) {
    // 1. إنشاء القطع مرتبة
    const freshTiles: TileData[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      originalIndex: i,
      currentIndex: i,
    }));

    // 2. خلط Fisher-Yates
    for (let i = freshTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [freshTiles[i], freshTiles[j]] = [freshTiles[j], freshTiles[i]];
    }

    // 3. التحقق من عدد القطع التي بقيت في مكانها الصحيح
    const correctCount = freshTiles.filter((t, idx) => t.originalIndex === idx).length;
    const correctRatio = correctCount / count;

    // إذا كانت نسبة القطع الصحيحة أقل من 20% أو كان عدد المحاولات كبيراً، نقبل النتيجة
    // في الشبكات الصغيرة (3x3) نسمح بنسبة أعلى قليلاً لصعوبة التشتيت الكامل
    const threshold = gridSize <= 3 ? 0.3 : 0.15;
    
    if (correctRatio <= threshold || attempts >= 9) {
      tiles = freshTiles;
      isTooEasy = false;
    }
    attempts++;
  }

  // تحديث الفهرس الحالي ليعكس الترتيب النهائي
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
