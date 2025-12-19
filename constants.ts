
import { Difficulty, LevelConfig } from './types.ts';

// قائمة متنوعة جداً من الصور (ليست طبيعة فقط) لضمان اختلاف كل مرحلة
const imagePool = [
  'photo-1451187580459-43490279c0fa', // فضاء وتكنولوجيا
  'photo-1517841905240-472988babdf9', // كلب (حيوانات)
  'photo-1449824913935-59a10b8d2000', // مدينة وهندسة معمارية
  'photo-1504674900247-0877df9cc836', // طعام وفن طبخ
  'photo-1550745165-9bc0b252726f', // إلكترونيات وألعاب (Retro)
  'photo-1533473359331-0135ef1b58bf', // سيارة كلاسيكية
  'photo-1541701494587-cb58502866ab', // فن تجريدي ألوان
  'photo-1518770660439-4636190af475', // دوائر إلكترونية (Tech)
  'photo-1534528741775-53994a69daeb', // بورتريه ألوان قوية
  'photo-1511576661531-b3817ad190eb', // مدينة في الليل (Neon)
  'photo-1523275335684-37898b6baf30', // منتجات وساعات (Minimal)
  'photo-1516035069371-29a1b244cc32', // كاميرا تصوير (Object)
  'photo-1558591710-4b4a1ad0f048', // خلفية تجريدية ثلاثية الأبعاد
  'photo-1506318137071-a8e063b4bed0', // سديم فضاء وألوان
  'photo-1493246507139-91e8bef99c02', // جبال ثلجية (مختلفة)
  'photo-1564349683136-77e08bef1ed4', // دب باندا (حيوانات)
  'photo-1581091226825-a6a2a5aee158', // روبوت وذكاء اصطناعي
  'photo-1486406146926-c627a92ad1ab', // ناطحة سحاب حديثة
  'photo-1510915228340-29c85a430c75', // برمجة وأكواد
  'photo-1555066931-4365d14bab8c', // كيبورد مضيء
  'photo-1501183638710-841dd1904471', // غابة (Dark Forest)
  'photo-1490730141103-6cac27aaab94', // غروب شمس سريالي
  'photo-1520113523783-441ad74b6788', // قطة (حيوانات)
  'photo-1496715976403-7e36dc43f17b', // رسم فني (Illustration)
  'photo-1502675135487-e971002a6adb', // قطار سريع
  'photo-1464802686167-b939a67e06a1', // خريطة العالم (Map)
  'photo-1550684848-fac1c5b4e853', // نمط تجريدي (Pattern)
  'photo-1523712999610-f77fbcfc3843', // خريف أحمر
  'photo-1454165833222-d157a5a5be34', // مكتب عمل حديث
  'photo-1519060890537-029858382c90'  // منارة بحرية
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

    // نختار صورة من المجموعة بطريقة تضمن التنوع الشديد
    const photoId = imagePool[i % imagePool.length];
    
    // أضفنا &w=1000 لزيادة جودة الصورة وتوضيحها عند التكبير
    const image = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=90&w=1000&sig=${levelId}`;

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
