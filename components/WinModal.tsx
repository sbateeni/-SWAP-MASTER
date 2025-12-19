
import React from 'react';

interface WinModalProps {
  level: number;
  stars: number;
  moves: number;
  time: number;
  onNext: () => void;
  onRestart: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ level, stars, moves, time, onNext, onRestart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center animate-in zoom-in duration-300">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-2">Level {level} Complete!</h2>
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <span key={s} className={`text-4xl ${s <= stars ? 'text-yellow-400' : 'text-slate-600'}`}>
              ★
            </span>
          ))}
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-4 mb-8 flex justify-around text-sm">
          <div>
            <div className="text-slate-400 uppercase text-xs font-bold">Moves</div>
            <div className="text-xl font-semibold text-white">{moves}</div>
          </div>
          <div>
            <div className="text-slate-400 uppercase text-xs font-bold">Time</div>
            <div className="text-xl font-semibold text-white">{time}s</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onNext}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-indigo-900/20"
          >
            Next Level
          </button>
          <button
            onClick={onRestart}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;
