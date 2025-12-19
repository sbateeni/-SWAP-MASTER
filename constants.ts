
import { Difficulty, LevelConfig } from './types';

// قائمة متنوعة من معرفات Unsplash لضمان عدم التكرار
const imageIds = [
  'photo-1470071459604-3b5ec3a7fe05', 'photo-1441974231531-c6227db76b6e', 'photo-1501854140801-50d01698950b', 'photo-1472214103451-9374bd1c798e', 'photo-1464822759023-fed622ff2c3b',
  'photo-1506744038136-46273834b3fb', 'photo-1469474968028-56623f02e42e', 'photo-1447752875215-b2761acb3c5d', 'photo-1433086966358-54859d0ed716', 'photo-1470770841072-f978cf4d019e',
  'photo-1511497584788-876760111969', 'photo-1445262102387-5febb59a56bb', 'photo-1493246507139-91e8bef99c02', 'photo-1500382017468-9049fed747ef', 'photo-1475924156734-496f6cac6ec1',
  'photo-1532274402911-5a3b127c5d83', 'photo-1414235077428-338989a2e8c0', 'photo-1518709268805-4e9042af9f23', 'photo-1501785888041-af3ef285b470', 'photo-1431411207774-da3c7311b5a8',
  'photo-1470252649358-96f3c8024217', 'photo-1505118380757-91f5f5632de0', 'photo-1490682143124-fc932c635707', 'photo-1439405326854-0151a2346738', 'photo-1502082553245-f0bc5a6f7770',
  'photo-1500627845660-c7167169803e', 'photo-1434725039720-abb26ce2220b', 'photo-1444464666168-49d633b86747', 'photo-1470246973918-29a93221c455', 'photo-1508138221679-760a23a2285b',
  'photo-1518173946687-a4c8a07d7ef0', 'photo-1523712999610-f77fbcfc3843', 'photo-1493552152660-f915ab47ae9d', 'photo-1465146344425-f00d5f5c8f07', 'photo-1426604966848-d7adac402bff',
  'photo-1504198453319-5ce911bafcde', 'photo-1419242902214-272b3f66ee7a', 'photo-1473448912268-2022ce9509d8', 'photo-1496715976403-7e36dc43f17b', 'photo-1501862700950-18382cd41497',
  'photo-1498855926480-d98e83099315', 'photo-1462331940025-496dfbfc7564', 'photo-1446776811953-b23d57bd21aa', 'photo-1484406566174-9da000fda645', 'photo-1520113523783-441ad74b6788',
  'photo-1510784722466-f2aa9c52fe67', 'photo-1516026672322-bc52d61a55d5', 'photo-1497436072909-60f360e1d4b1', 'photo-1507525428034-b723cf961d3e', 'photo-1519060890537-029858382c90',
  'photo-1500964757637-c85e8a162699', 'photo-1482933221570-6ce621d6d61d', 'photo-1502675135487-e971002a6adb', 'photo-1534067783941-51c9c23ceff3', 'photo-1513836279014-a89f7a76ae86',
  'photo-1500530855697-b586d89ba3ee', 'photo-1504280390367-361c6d9f38f4', 'photo-1506260408121-e353ac1d021b', 'photo-1511884642898-4c92249e20b6', 'photo-1441759430857-79471b46760e',
  // فضاء وتقنيات
  'photo-1451187580459-43490279c0fa', 'photo-1446776811953-b23d57bd21aa', 'photo-1446941611757-91d2c3bd3d45', 'photo-1506318137071-a8e063b4bed0', 'photo-1464802686167-b939a67e06a1',
  'photo-1481349518771-20055b2a7b24', 'photo-1518770660439-4636190af475', 'photo-1526374965328-7f61d4dc18c5', 'photo-1550751827-4bd374c3f58b', 'photo-1518770660439-4636190af475',
  // فنون وتجريد
  'photo-1541701494587-cb58502866ab', 'photo-1550684848-fac1c5b4e853', 'photo-1549490349-8643362247b5', 'photo-1558591710-4b4a1ad0f048', 'photo-1515405290399-fcd57817b475',
  'photo-1505330622279-bf7d7fc918f4', 'photo-1554188248-986adbb73be4', 'photo-1579783902614-a3fb3927b6a5', 'photo-1533158307587-828f0a76ef46', 'photo-1502691876148-a84978f5d88b',
  // مدن ومعمار
  'photo-1477959858617-67f85cf4f1df', 'photo-1449824913935-59a10b8d2000', 'photo-1486406146926-c627a92ad1ab', 'photo-1444723121867-7a241cacace9', 'photo-1514565131-fce0801e5785',
  'photo-1496568816309-51d7c7083121', 'photo-1502899576159-f224dc23ef8a', 'photo-1534430480872-3498386e7a56', 'photo-1428366484574-1b0cc4424ee4', 'photo-1493397212122-2b85dda8106b'
];

// دالة لتوليد المراحل ديناميكياً لتصل لـ 160 مرحلة
const generateLevels = (): LevelConfig[] => {
  const levels: LevelConfig[] = [];
  const totalLevels = 160;

  for (let i = 0; i < totalLevels; i++) {
    const levelId = i + 1;
    let gridSize = 3;
    let difficulty = Difficulty.EASY;
    let showNumbers = true;
    let timeLimit: number | undefined = undefined;
    let moveLimit: number | undefined = undefined;

    // تدرج الصعوبة
    if (levelId <= 20) {
      gridSize = 3;
      difficulty = Difficulty.EASY;
      showNumbers = true;
    } else if (levelId <= 50) {
      gridSize = 4;
      difficulty = Difficulty.MEDIUM;
      showNumbers = false;
      if (levelId > 40) moveLimit = 40;
    } else if (levelId <= 80) {
      gridSize = 5;
      difficulty = Difficulty.HARD;
      showNumbers = false;
      timeLimit = 300; // 5 mins
      moveLimit = 80;
    } else if (levelId <= 110) {
      gridSize = 6;
      difficulty = Difficulty.EXPERT;
      showNumbers = false;
      timeLimit = 480; // 8 mins
      moveLimit = 150;
    } else if (levelId <= 140) {
      gridSize = 8;
      difficulty = Difficulty.MASTER;
      showNumbers = false;
      timeLimit = 600; // 10 mins
      moveLimit = 300;
    } else {
      gridSize = 10;
      difficulty = Difficulty.LEGENDARY;
      showNumbers = false;
      timeLimit = 900; // 15 mins
      moveLimit = 500;
    }

    // اختيار صورة من القائمة المتاحة (تكرار إذا لزم الأمر مع تغيير بسيط في الحجم)
    const imageId = imageIds[i % imageIds.length];
    const image = `https://images.unsplash.com/${imageId}?auto=format&fit=crop&q=80&w=800`;

    levels.push({
      id: levelId,
      difficulty,
      gridSize,
      image,
      showNumbers,
      timeLimit,
      moveLimit
    });
  }

  return levels;
};

export const LEVELS: LevelConfig[] = generateLevels();
