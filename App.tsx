
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LEVELS } from './constants';
import { GameState, TileData, View } from './types';
import { shuffleTiles, checkWin, calculateStars } from './utils/helpers';
import { saveProgress, getCompletedLevels, getLastPlayedLevel, saveLastPlayedLevel } from './utils/db';
import PuzzleBoard from './components/PuzzleBoard';
import WinModal from './components/WinModal';
import LevelSelector from './components/LevelSelector';
import Fireworks from './components/Fireworks';

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
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<number | null>(null);

  const level = LEVELS[gameState.currentLevelIdx];

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const completed = await getCompletedLevels();
        const lastPlayed = await getLastPlayedLevel();
        setGameState(prev => ({ 
          ...prev, 
          unlockedLevels: completed,
          currentLevelIdx: lastPlayed
        }));
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadProgress();
  }, []);

  const startLevel = useCallback(async (levelIdx: number) => {
    const targetLevel = LEVELS[levelIdx];
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
    if (gameState.view === 'playing' && gameState.status === 'playing') {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.status, gameState.view]);

  useEffect(() => {
    if (gameState.view === 'playing' && gameState.status === 'playing') {
      if (level.timeLimit && gameState.time >= level.timeLimit) {
        setGameState(prev => ({ ...prev, status: 'lost' }));
      }
      if (level.moveLimit && gameState.moves >= level.moveLimit) {
        setGameState(prev => ({ ...prev, status: 'lost' }));
      }
    }
  }, [gameState.time, gameState.moves, level, gameState.status, gameState.view]);

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
           <p className="text-slate-500 font-bold uppercase tracking-[0.4em] mt-6 text-sm">
             Ultimate Image Puzzle Challenge
           </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs animate-in slide-in-from-bottom-12 duration-700 delay-300">
          <button 
            onClick={() => startLevel(gameState.currentLevelIdx)}
            className="group relative bg-white text-slate-950 py-5 rounded-3xl font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10">{gameState.unlockedLevels.length > 0 ? 'RESUME GAME' : 'START GAME'}</span>
          </button>
          
          <button 
            onClick={() => setGameState(prev => ({ ...prev, view: 'levels' }))}
            className="bg-slate-900 text-slate-300 py-4 rounded-3xl font-bold border border-slate-800 transition-all hover:bg-slate-800"
          >
            ALL LEVELS
          </button>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-slate-900/50 p-4 rounded-3xl border border-slate-800 text-center">
               <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total</div>
               <div className="text-xl font-black text-white">{LEVELS.length}</div>
            </div>
            <div className="flex-1 bg-slate-900/50 p-4 rounded-3xl border border-slate-800 text-center">
               <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Completed</div>
               <div className="text-xl font-black text-white">{gameState.unlockedLevels.length}</div>
            </div>
          </div>
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
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-slate-950 text-slate-100">
      {gameState.status === 'won' && <Fireworks />}
      
      <header className="w-full max-w-2xl flex justify-between items-end mb-8">
        <button 
          onClick={() => setGameState(prev => ({ ...prev, view: 'levels' }))}
          className="group flex flex-col"
        >
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-indigo-500 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Back to levels</span>
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white">LEVEL {level.id}</h1>
        </button>
        
        <div className="flex gap-2">
          <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800/50 text-center min-w-[80px]">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-tight">Moves</span>
            <span className="text-xl font-black text-white">{gameState.moves}</span>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800/50 text-center min-w-[80px]">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-tight">Time</span>
            <span className="text-xl font-black text-white">{gameState.time}s</span>
          </div>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-lg">
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
            <div className="absolute inset-0 z-40 rounded-3xl overflow-hidden shadow-2xl cursor-pointer" onClick={() => setShowHint(false)}>
              <img src={level.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center">
                <div className="bg-indigo-600/90 text-white px-8 py-4 rounded-full font-black text-sm tracking-widest animate-pulse">TAP TO RESUME</div>
              </div>
            </div>
          )}

          {gameState.status === 'lost' && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl rounded-3xl">
              <span className="text-5xl mb-4">⏰</span>
              <h2 className="text-4xl font-black text-white mb-2 italic">GAME OVER</h2>
              <button
                onClick={() => startLevel(gameState.currentLevelIdx)}
                className="bg-indigo-600 text-white px-12 py-5 rounded-full font-black mt-4 shadow-xl shadow-indigo-600/20"
              >
                RETRY LEVEL
              </button>
            </div>
          )}
        </div>

        {gameState.status === 'won' ? (
          <div className="w-full animate-in slide-in-from-bottom-8 duration-500">
            <button
              onClick={goToNextLevel}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-emerald-900/20 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <span>NEXT LEVEL</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
            <div className="mt-4 text-center">
              <span className="text-slate-500 font-black uppercase text-xs tracking-widest">Excellent Work!</span>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 w-full justify-center max-w-[420px]">
            <button
              onClick={() => setShowHint(true)}
              className="flex-1 flex flex-col items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-800 text-white py-4 rounded-3xl transition-all border border-slate-800/50 shadow-xl"
            >
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">View Hint</span>
            </button>
            <button
              onClick={() => startLevel(gameState.currentLevelIdx)}
              className="flex-1 flex flex-col items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-800 text-white py-4 rounded-3xl transition-all border border-slate-800/50 shadow-xl"
            >
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Restart</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
