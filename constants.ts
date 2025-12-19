
import { Difficulty, LevelConfig } from './types.ts';

// قائمة معرفات صور موثوقة من Unsplash لضمان الظهور
const imagePool = [
  'photo-1470071459604-3b5ec3a7fe05', 'photo-1441974231531-c6227db76b6e', 'photo-1501854140801-50d01698950b', 'photo-1472214103451-9374bd1c798e', 'photo-1464822759023-fed622ff2c3b',
  'photo-1506744038136-46273834b3fb', 'photo-1469474968028-56623f02e42e', 'photo-1447752875215-b2761acb3c5d', 'photo-1433086966358-54859d0ed716', 'photo-1470770841072-f978cf4d019e',
  'photo-1511497584788-876760111969', 'photo-1445262102387-5febb59a56bb', 'photo-1493246507139-91e8bef99c02', 'photo-1500382017468-9049fed747ef', 'photo-1475924156734-496f6cac6ec1',
  'photo-1532274402911-5a3b127c5d83', 'photo-1414235077428-338989a2e8c0', 'photo-1518709268805-4e9042af9f23', 'photo-1501785888041-af3ef285b470', 'photo-1431411207774-da3c7311b5a8',
  'photo-1470252649358-96f3c8024217', 'photo-1505118380757-91f5f5632de0', 'photo-1490682143124-fc932c635707', 'photo-1439405326854-0151a2346738', 'photo-1502082553245-f0bc5a6f7770',
  'photo-1504674900247-0877df9cc836', 'photo-1476514525535-07fb3b4ae5f1', 'photo-1501183638710-841dd1904471', 'photo-1499002297771-cdb574a59e8e', 'photo-1500673922987-e212871fec22'
];

const generateLevels = (): LevelConfig[] => {
  const levels: LevelConfig[] = [];
  const totalLevels = 500;

  for (let i = 0; i < totalLevels; i++) {
    const levelId = i + 1;
    let gridSize = 3;
    let difficulty = Difficulty.EASY;
    let timeLimit: number | undefined = undefined;
    let moveLimit: number | undefined = undefined;

    // التقسيم الجديد بناءً على طلبك
    if (levelId <= 20) {
      // مراحل 1-20: 3x3 فقط
      gridSize = 3;
      difficulty = Difficulty.EASY;
    } else if (levelId <= 150) {
      // بعد المرحلة 20: القفز لـ 6x6
      gridSize = 6;
      difficulty = Difficulty.EXPERT;
      timeLimit = 480; // 8 mins
      moveLimit = 200;
    } else if (levelId <= 350) {
      // تدرج لـ 7x7
      gridSize = 7;
      difficulty = Difficulty.MASTER;
      timeLimit = 600; // 10 mins
      moveLimit = 350;
    } else {
      // لغاية 8x8 للمراحل الأخيرة
      gridSize = 8;
      difficulty = Difficulty.LEGENDARY;
      timeLimit = 900; // 15 mins
      moveLimit = 600;
    }

    const photoId = imagePool[i % imagePool.length];
    // استخدام رابط Unsplash المباشر لضمان العمل
    const image = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=800&sig=${levelId}`;

    levels.push({
      id: levelId,
      difficulty,
      gridSize,
      image,
      showNumbers: false,
      timeLimit,
      moveLimit
    });
  }

  return levels;
};

export const LEVELS: LevelConfig[] = generateLevels();
