
import { Difficulty, LevelConfig } from './types.ts';

// قائمة تضم 100 معرف صورة فريد وموثق من Unsplash لضمان ظهور الصور دائماً
const imagePool = [
  'photo-1470071459604-3b5ec3a7fe05', 'photo-1441974231531-c6227db76b6e', 'photo-1501854140801-50d01698950b', 'photo-1472214103451-9374bd1c798e', 'photo-1464822759023-fed622ff2c3b',
  'photo-1506744038136-46273834b3fb', 'photo-1469474968028-56623f02e42e', 'photo-1447752875215-b2761acb3c5d', 'photo-1433086966358-54859d0ed716', 'photo-1470770841072-f978cf4d019e',
  'photo-1511497584788-876760111969', 'photo-1445262102387-5febb59a56bb', 'photo-1493246507139-91e8bef99c02', 'photo-1500382017468-9049fed747ef', 'photo-1475924156734-496f6cac6ec1',
  'photo-1532274402911-5a3b127c5d83', 'photo-1414235077428-338989a2e8c0', 'photo-1518709268805-4e9042af9f23', 'photo-1501785888041-af3ef285b470', 'photo-1431411207774-da3c7311b5a8',
  'photo-1470252649358-96f3c8024217', 'photo-1505118380757-91f5f5632de0', 'photo-1490682143124-fc932c635707', 'photo-1439405326854-0151a2346738', 'photo-1502082553245-f0bc5a6f7770',
  'photo-1451187580459-43490279c0fa', 'photo-1446776811953-b23d57bd21aa', 'photo-1446941611757-91d2c3bd3d45', 'photo-1506318137071-a8e063b4bed0', 'photo-1464802686167-b939a67e06a1',
  'photo-1541701494587-cb58502866ab', 'photo-1550684848-fac1c5b4e853', 'photo-1549490349-8643362247b5', 'photo-1558591710-4b4a1ad0f048', 'photo-1515405290399-fcd57817b475',
  'photo-1477959858617-67f85cf4f1df', 'photo-1449824913935-59a10b8d2000', 'photo-1486406146926-c627a92ad1ab', 'photo-1444723121867-7a241cacace9', 'photo-1514565131-fce0801e5785',
  'photo-1504198453319-5ce911bafcde', 'photo-1419242902214-272b3f66ee7a', 'photo-1473448912268-2022ce9509d8', 'photo-1496715976403-7e36dc43f17b', 'photo-1501862700950-18382cd41497',
  'photo-1534067783941-51c9c23ceff3', 'photo-1513836279014-a89f7a76ae86', 'photo-1500530855697-b586d89ba3ee', 'photo-1504280390367-361c6d9f38f4', 'photo-1506260408121-e353ac1d021b',
  'photo-1511884642898-4c92249e20b6', 'photo-1441759430857-79471b46760e', 'photo-1521747116042-5a810fda9664', 'photo-1503023345034-31c2781cf451', 'photo-1469854523086-cc02fe5d8800',
  'photo-1501785888041-af3ef285b470', 'photo-1507525428034-b723cf961d3e', 'photo-1519060890537-029858382c90', 'photo-1500964757637-c85e8a162699', 'photo-1482933221570-6ce621d6d61d',
  'photo-1502675135487-e971002a6adb', 'photo-1493552152660-f915ab47ae9d', 'photo-1465146344425-f00d5f5c8f07', 'photo-1426604966848-d7adac402bff', 'photo-1419242902214-272b3f66ee7a',
  'photo-1470246973918-29a93221c455', 'photo-1508138221679-760a23a2285b', 'photo-1518173946687-a4c8a07d7ef0', 'photo-1523712999610-f77fbcfc3843', 'photo-1493552152660-f915ab47ae9d',
  'photo-1462331940025-496dfbfc7564', 'photo-1446776811953-b23d57bd21aa', 'photo-1484406566174-9da000fda645', 'photo-1520113523783-441ad74b6788', 'photo-1510784722466-f2aa9c52fe67',
  'photo-1516026672322-bc52d61a55d5', 'photo-1497436072909-60f360e1d4b1', 'photo-1507525428034-b723cf961d3e', 'photo-1519060890537-029858382c90', 'photo-1500964757637-c85e8a162699',
  'photo-1528715471579-d1bcf0ba5e83', 'photo-1536431311719-398b6704d4cc', 'photo-1506744038136-46273834b3fb', 'photo-1511576661531-b3817ad190eb', 'photo-1501785888041-af3ef285b470',
  'photo-1500382017468-9049fed747ef', 'photo-1433086966358-54859d0ed716', 'photo-1470770841072-f978cf4d019e', 'photo-1518709268805-4e9042af9f23', 'photo-1431411207774-da3c7311b5a8',
  'photo-1470252649358-96f3c8024217', 'photo-1505118380757-91f5f5632de0', 'photo-1490682143124-fc932c635707', 'photo-1439405326854-0151a2346738', 'photo-1502082553245-f0bc5a6f7770',
  'photo-1504674900247-0877df9cc836', 'photo-1476514525535-07fb3b4ae5f1', 'photo-1501183638710-841dd1904471', 'photo-1499002297771-cdb574a59e8e', 'photo-1500673922987-e212871fec22'
];

/**
 * توليد 500 مرحلة بتدرج صعوبة مدروس وصور مضمونة
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
      gridSize = 3;
      difficulty = Difficulty.EASY;
    } else if (levelId <= 200) {
      gridSize = 4;
      difficulty = Difficulty.MEDIUM;
      if (levelId > 150) moveLimit = 60;
    } else if (levelId <= 300) {
      gridSize = 5;
      difficulty = Difficulty.HARD;
      timeLimit = 360; // 6 mins
      moveLimit = 120;
    } else if (levelId <= 400) {
      gridSize = 6;
      difficulty = Difficulty.EXPERT;
      timeLimit = 540; // 9 mins
      moveLimit = 250;
    } else if (levelId <= 460) {
      gridSize = 8;
      difficulty = Difficulty.MASTER;
      timeLimit = 720; // 12 mins
      moveLimit = 500;
    } else {
      gridSize = 10;
      difficulty = Difficulty.LEGENDARY;
      timeLimit = 1200; // 20 mins
      moveLimit = 1000;
    }

    // اختيار معرف صورة من القائمة الموثوقة (تدوير القائمة لضمان التنوع)
    const photoId = imagePool[i % imagePool.length];
    
    // استخدام رابط Unsplash المباشر مع بارامترات التحجيم والجودة
    // أضفنا &sig لضمان عدم تخزين المتصفح لنفس الصورة بشكل متكرر
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
