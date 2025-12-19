
import { Difficulty, LevelConfig } from './types.ts';

// قائمة صور متنوعة جداً ومثبتة الترتيب
const imagePool = [
  'photo-1451187580459-43490279c0fa', // 1: فضاء
  'photo-1517841905240-472988babdf9', // 2: حيوانات
  'photo-1449824913935-59a10b8d2000', // 3: عمارة
  'photo-1504674900247-0877df9cc836', // 4: طعام
  'photo-1550745165-9bc0b252726f', // 5: تقنية
  'photo-1533473359331-0135ef1b58bf', // 6: سيارات
  'photo-1541701494587-cb58502866ab', // 7: فن
  'photo-1518770660439-4636190af475', // 8: دوائر
  'photo-1534528741775-53994a69daeb', // 9: بورتريه
  'photo-1511576661531-b3817ad190eb', // 10: لندن
  'photo-1523275335684-37898b6baf30', // 11: ساعة
  'photo-1516035069371-29a1b244cc32', // 12: كاميرا
  'photo-1558591710-4b4a1ad0f048', // 13: تجريدي 3D
  'photo-1506318137071-a8e063b4bed0', // 14: سديم
  'photo-1493246507139-91e8bef99c02', // 15: جبال
  'photo-1564349683136-77e08bef1ed4', // 16: باندا
  'photo-1581091226825-a6a2a5aee158', // 17: روبوت
  'photo-1486406146926-c627a92ad1ab', // 18: ناطحة سحاب
  'photo-1510915228340-29c85a430c75', // 19: كود
  'photo-1555066931-4365d14bab8c', // 20: كيبورد
  'photo-1501183638710-841dd1904471', // 21: غابة
  'photo-1490730141103-6cac27aaab94', // 22: غروب
  'photo-1520113523783-441ad74b6788', // 23: قطة
  'photo-1496715976403-7e36dc43f17b', // 24: رسم
  'photo-1502675135487-e971002a6adb', // 25: قطار
  'photo-1464802686167-b939a67e06a1', // 26: خريطة
  'photo-1550684848-fac1c5b4e853', // 27: نمط
  'photo-1523712999610-f77fbcfc3843', // 28: خريف
  'photo-1454165833222-d157a5a5be34', // 29: مكتب
  'photo-1519060890537-029858382c90', // 30: منارة
  // صور إضافية لضمان التنوع الكامل
  'photo-1470071459604-3b5ec3a7fe05',
  'photo-1441974231531-c6227db76b6e',
  'photo-1501854140801-50d01698950b',
  'photo-1469474968028-56623f02e42e',
  'photo-1447752875215-b2761acb3c5d',
  'photo-1433086566608-5732f1683018',
  'photo-1505740420928-5e560c06d30e',
  'photo-1526170315870-ef0d2a0003e2',
  'photo-1484154218962-a197022b5858',
  'photo-1513542789411-b6a5d4f31634'
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

    if (levelId <= 20) {
      gridSize = 3;
      difficulty = Difficulty.EASY;
    } else if (levelId <= 150) {
      gridSize = 6;
      difficulty = Difficulty.EXPERT;
      timeLimit = 480;
      moveLimit = 200;
    } else if (levelId <= 350) {
      gridSize = 7;
      difficulty = Difficulty.MASTER;
      timeLimit = 600;
      moveLimit = 350;
    } else {
      gridSize = 8;
      difficulty = Difficulty.LEGENDARY;
      timeLimit = 900;
      moveLimit = 600;
    }

    const photoId = imagePool[i % imagePool.length];
    // استخدام رابط Unsplash بجودة عالية وبدون sig إذا لم نحتاجه لضمان الاستقرار
    const image = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=800`;

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
