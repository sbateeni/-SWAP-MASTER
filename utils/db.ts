
const DB_NAME = 'TileSwapMasterDB';
const STORE_NAME = 'game_progress_v3';
const DB_VERSION = 3;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveProgress = async (completedLevelIdx: number): Promise<void> => {
  const db = await initDB();
  const completed = await getCompletedLevels();
  if (!completed.includes(completedLevelIdx)) {
    completed.push(completedLevelIdx);
  }
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(completed, 'completedLevels');
    store.put(completedLevelIdx, 'lastPlayedLevelIdx');
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const saveLastPlayedLevel = async (levelIdx: number): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(levelIdx, 'lastPlayedLevelIdx');
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getCompletedLevels = async (): Promise<number[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('completedLevels');
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

export const getLastPlayedLevel = async (): Promise<number> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('lastPlayedLevelIdx');
    request.onsuccess = () => resolve(request.result !== undefined ? request.result : 0);
    request.onerror = () => reject(request.error);
  });
};
