
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LEVELS } from './constants.ts';
import { GameState, TileData } from './types.ts';
import { shuffleTiles, checkWin } from './utils/helpers.ts';
import { saveProgress, getCompletedLevels, getLastPlayedLevel, saveLastPlayedLevel } from './utils/db.ts';
import PuzzleBoard from './components/PuzzleBoard.tsx';
import LevelSelector from './components/LevelSelector.tsx';
import Fireworks from './components/Fireworks.tsx';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevelIdx: 0,
    tiles: [],
    moves: 0,
    time: 0,
    isWon: false,
    status: 'playing',
    view: 'menu',
    unlockedLevels: []
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isImageReady, setIsImageReady] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<number | null>(null);

  const level = LEVELS[gameState.currentLevelIdx] || LEVELS[0];

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const completed = await getCompletedLevels();
        const lastPlayed = await getLastPlayedLevel();
        const safeLastPlayed = (lastPlayed >= 0 && lastPlayed < LEVELS.length) ? lastPlayed : 0;

        setGameState(prev => ({ 
          ...prev, 
          unlockedLevels: completed,
          currentLevelIdx: safeLastPlayed
        }));
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadProgress();
  }, []);

  const preloadImage = (url: string) => {
    if (!url) return;
    setIsImageReady(false);
    const img = new Image();
    img.src = url;
    img.onload = () => setIsImageReady(true);
    img.onerror = () => {
      console.error("Failed to load image:", url);
      setIsImageReady(true);
    };
  };

  // مراقبة تغيير المستوى أو الدخول لوضع اللعب لضمان تحميل الصورة
  useEffect(() => {
    if (isLoaded && gameState.view === 'playing') {
      const currentLevel = LEVELS[gameState.currentLevelIdx];
      if (currentLevel) {
        preloadImage(currentLevel.image);
      }
    }
  }, [isLoaded, gameState.view, gameState.currentLevelIdx]);

  const startLevel = useCallback(async (levelIdx: number) => {
    const targetLevel = LEVELS[levelIdx] || LEVELS[0];
    preloadImage(targetLevel.image);
    
    setGameState(prev => ({
      ...prev,
      currentLevelIdx: levelIdx,
      tiles: shuffleTiles(targetLevel.gridSize),
      moves: 0,
      time: 0,
      isWon: false,
      status: 'playing',
      view: 'playing'
    }));
    setShowHint(false);
    await saveLastPlayedLevel(levelIdx);
  }, []);

  useEffect(() => {
    if (gameState.view === 'playing' && gameState.status === 'playing' && isImageReady) {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.status, gameState.view, isImageReady]);

  const handleSwap = async (fromIndex: number, toIndex: number) => {
    if (gameState.status !== 'playing') return;

    const newTiles = [...gameState.tiles];
    const temp = { ...newTiles[fromIndex] };
    newTiles[fromIndex] = { ...newTiles[toIndex] };
    newTiles[toIndex] = temp;

    const isWon = checkWin(newTiles);

    if (isWon) {
      await saveProgress(gameState.currentLevelIdx);
      const updatedUnlocked = await getCompletedLevels();
      setGameState(prev => ({
        ...prev,
        tiles: newTiles,
        moves: prev.moves + 1,
        isWon: true,
        status: 'won',
        unlockedLevels: updatedUnlocked
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        tiles: newTiles,
        moves: prev.moves + 1
      }));
    }
  };

  const goToNextLevel = useCallback(() => {
    const nextIdx = (gameState.currentLevelIdx + 1) % LEVELS.length;
    startLevel(nextIdx);
  }, [gameState.currentLevelIdx, startLevel]);

  if (!isLoaded) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Initializing...</p>
    </div>
  );

  if (gameState.view === 'menu') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-12 animate-in fade-in zoom-in duration-1000">
           <div className="relative inline-block">
             <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full"></div>
             <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl">
               SWAP<br/>MASTER
             </h1>
           </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs animate-in slide-in-from-bottom-12 duration-700">
          <button 
            onClick={() => startLevel(gameState.currentLevelIdx)}
            className="group relative bg-white text-slate-950 py-5 rounded-3xl font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            {gameState.unlockedLevels.length > 0 ? 'RESUME' : 'PLAY NOW'}
          </button>
          
          <button 
            onClick={() => setGameState(prev => ({ ...prev, view: 'levels' }))}
            className="bg-slate-900 text-slate-300 py-4 rounded-3xl font-bold border border-slate-800 transition-all hover:bg-slate-800"
          >
            LEVELS
          </button>
        </div>
      </div>
    );
  }

  if (gameState.view === 'levels') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center p-8">
        <LevelSelector 
          unlockedLevels={gameState.unlockedLevels}
          onSelect={startLevel}
          onBack={() => setGameState(prev => ({ ...prev, view: 'menu' }))}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center p-4 bg-slate-950 text-slate-100 overflow-hidden">
      {gameState.status === 'won' && <Fireworks />}
      
      <header className="w-full max-w-2xl flex justify-between items-center mb-6 mt-2">
        <button 
          onClick={() => setGameState(prev => ({ ...prev, view: 'levels' }))}
          className="bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
          <span className="font-black italic">LEVEL {level.id}</span>
        </button>
        
        <div className="flex gap-2">
          <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 text-center min-w-[80px]">
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Moves</span>
            <span className="text-lg font-black">{gameState.moves}</span>
          </div>
          <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 text-center min-w-[80px]">
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Time</span>
            <span className="text-lg font-black">{gameState.time}s</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full relative">
        {!isImageReady ? (
           <div className="flex flex-col items-center animate-pulse">
             <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-slate-500 font-bold text-xs tracking-widest uppercase">Fetching Image...</p>
           </div>
        ) : (
          <div className="relative">
            <PuzzleBoard
              tiles={gameState.tiles}
              gridSize={level.gridSize}
              imageUrl={level.image}
              showNumbers={level.showNumbers}
              onSwap={handleSwap}
              disabled={gameState.status !== 'playing'}
            />
            
            {showHint && (
              <div className="absolute inset-0 z-40 rounded-3xl overflow-hidden cursor-pointer" onClick={() => setShowHint(false)}>
                <img src={level.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center">
                  <div className="bg-indigo-600 px-6 py-3 rounded-full font-black">TAP TO CLOSE</div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="w-full max-w-lg mt-6 mb-4">
        {gameState.status === 'won' ? (
          <button
            onClick={goToNextLevel}
            className="w-full bg-emerald-500 text-white py-5 rounded-3xl font-black text-xl shadow-2xl animate-bounce"
          >
            NEXT CHALLENGE
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => setShowHint(true)}
              className="flex-1 bg-slate-900 text-indigo-400 py-4 rounded-2xl font-black border border-slate-800"
            >
              HINT
            </button>
            <button
              onClick={() => startLevel(gameState.currentLevelIdx)}
              className="flex-1 bg-slate-900 text-slate-400 py-4 rounded-2xl font-black border border-slate-800"
            >
              RESTART
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default App;
