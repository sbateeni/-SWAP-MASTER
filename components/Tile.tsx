
import React from 'react';
import { TileData } from '../types.ts';

interface TileProps {
  index: number;
  tile: TileData;
  gridSize: number;
  imageUrl: string;
  showNumbers: boolean;
  disabled: boolean;
  isDragging: boolean;
  isTarget: boolean;
  onPointerDown: (index: number, e: React.PointerEvent) => void;
}

const Tile: React.FC<TileProps> = ({
  index,
  tile,
  gridSize,
  imageUrl,
  showNumbers,
  disabled,
  isDragging,
  isTarget,
  onPointerDown
}) => {
  const isCorrect = tile.originalIndex === index;
  const row = Math.floor(tile.originalIndex / gridSize);
  const col = tile.originalIndex % gridSize;
  
  // حساب موقع الخلفية بدقة (0-100%)
  // نستخدم (gridSize - 1) لأننا نوزع 100% على عدد الفجوات بين القطع
  const bgPosX = gridSize > 1 ? (col / (gridSize - 1)) * 100 : 0;
  const bgPosY = gridSize > 1 ? (row / (gridSize - 1)) * 100 : 0;

  return (
    <div
      data-tile-index={index}
      onPointerDown={(e) => !disabled && onPointerDown(index, e)}
      className={`relative select-none transition-all duration-300 ease-out flex items-center justify-center bg-slate-800 ${
        isCorrect 
          ? 'z-0 p-0 border-0' 
          : 'z-10 p-[1px]' 
      }`}
      style={{ touchAction: 'none' }}
    >
      <div
        className={`w-full h-full transition-all duration-500 overflow-hidden shadow-sm bg-slate-800 ${
          isDragging 
            ? 'opacity-20 grayscale scale-95' 
            : isTarget 
              ? 'ring-4 ring-indigo-500 ring-inset z-20 brightness-110' 
              : isCorrect 
                ? 'shadow-none' 
                : 'rounded-sm border border-white/5 hover:border-indigo-500/50'
        }`}
        style={{
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: `${gridSize * 100}%`,
          backgroundPosition: `${bgPosX}% ${bgPosY}%`,
          backgroundRepeat: 'no-repeat'
        }}
      >
        {isTarget && (
          <div className="absolute inset-0 bg-indigo-500/20 animate-pulse pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default Tile;
