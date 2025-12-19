
import React, { useRef, useEffect } from 'react';
import { LEVELS } from '../constants';

interface LevelSelectorProps {
  unlockedLevels: number[];
  onSelect: (index: number) => void;
  onBack: () => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ unlockedLevels, onSelect, onBack }) => {
  const listRef = useRef<HTMLDivElement>(null);
  
  const isUnlocked = (idx: number) => idx === 0 || unlockedLevels.includes(idx - 1);
  const isCompleted = (idx: number) => unlockedLevels.includes(idx);

  // التمرير تلقائياً لآخر مستوى مفتوح
  useEffect(() => {
    const lastUnlockedIdx = unlockedLevels.length;
    const element = document.getElementById(`level-btn-${lastUnlockedIdx}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [unlockedLevels]);

  return (
    <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-500 pb-24">
      <div className="flex items-center justify-between mb-8 px-4 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl py-4 rounded-b-3xl">
        <div>
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white">ALL LEVELS</h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
            {unlockedLevels.length} / {LEVELS.length} COMPLETED
          </p>
        </div>
        <button 
          onClick={onBack}
          className="bg-slate-900/80 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800 transition-all active:scale-95 shadow-xl"
        >
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      <div ref={listRef} className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 px-4">
        {LEVELS.map((level, idx) => {
          const unlocked = isUnlocked(idx);
          const completed = isCompleted(idx);

          return (
            <button
              id={`level-btn-${idx}`}
              key={level.id}
              disabled={!unlocked}
              onClick={() => onSelect(idx)}
              className={`
                aspect-square rounded-2xl flex flex-col items-center justify-center transition-all relative overflow-hidden
                ${unlocked 
                  ? 'bg-slate-900 border-2 border-slate-800 hover:border-indigo-500 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-950/20' 
                  : 'bg-slate-950/50 border-2 border-slate-900 opacity-40 grayscale cursor-not-allowed'}
              `}
            >
              {unlocked && (
                <img 
                  src={level.image} 
                  className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" 
                  alt="" 
                />
              )}
              
              <div className="z-10 flex flex-col items-center">
                <span className={`text-xl font-black ${unlocked ? 'text-white' : 'text-slate-700'}`}>
                  {level.id}
                </span>
                <span className="text-[8px] font-bold opacity-50 text-slate-400 uppercase tracking-tighter">
                  {level.gridSize}x{level.gridSize}
                </span>
              </div>

              {completed && (
                <div className="absolute top-1 right-1 z-10">
                   <div className="bg-emerald-500 rounded-full p-0.5 shadow-lg">
                     <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                     </svg>
                   </div>
                </div>
              )}
              
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelector;
