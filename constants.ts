
import { Difficulty, LevelConfig } from './types.ts';

// تصنيفات الصور لضمان التنوع البصري الهائل
const categories = [
  'nature', 'space', 'architecture', 'abstract', 'ocean', 
  'mountain', 'forest', 'city', 'animal', 'technology', 
  'texture', 'galaxy', 'underwater', 'minimal', 'desert'
];

/**
 * توليد 500 مرحلة بتدرج صعوبة مدروس
 */
const generateLevels = (): LevelConfig[] => {
  const levels: LevelConfig[] = [];
  const totalLevels = 500;

  for (let i = 0; i < totalLevels; i++) {
    const levelId = i + 1;
    let gridSize = 3;
    let difficulty = Difficulty.EASY;
    let timeLimit: number | undefined = undefined;
    let moveLimit: number | undefined = undefined;

    // تدرج الصعوبة الموسع
    if (levelId <= 80) {
      gridSize = 3; // 3x3
      difficulty = Difficulty.EASY;
    } else if (levelId <= 200) {
      gridSize = 4; // 4x4
      difficulty = Difficulty.MEDIUM;
      if (levelId > 150) moveLimit = 50;
    } else if (levelId <= 300) {
      gridSize = 5; // 5x5
      difficulty = Difficulty.HARD;
      timeLimit = 300;
      moveLimit = 100;
    } else if (levelId <= 400) {
      gridSize = 6; // 6x6
      difficulty = Difficulty.EXPERT;
      timeLimit = 480;
      moveLimit = 180;
    } else if (levelId <= 460) {
      gridSize = 8; // 8x8
      difficulty = Difficulty.MASTER;
      timeLimit = 600;
      moveLimit = 350;
    } else {
      gridSize = 10; // 10x10 (Legendary)
      difficulty = Difficulty.LEGENDARY;
      timeLimit = 900;
      moveLimit = 600;
    }

    // بناء رابط الصورة باستخدام الكلمات المفتاحية و "التوقيع" لضمان تفرد كل مرحلة
    const category = categories[i % categories.length];
    const image = `https://images.unsplash.com/featured/?${category}&sig=${levelId}&auto=format&fit=crop&q=80&w=800`;

    levels.push({
      id: levelId,
      difficulty,
      gridSize,
      image,
      showNumbers: false, // دائماً بدون أرقام كما طلبت
      timeLimit,
      moveLimit
    });
  }

  return levels;
};

export const LEVELS: LevelConfig[] = generateLevels();
