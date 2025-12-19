
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
  
  // حساب موقع الخلفية بدقة
  const bgPosX = gridSize > 1 ? (col / (gridSize - 1)) * 100 : 0;
  const bgPosY = gridSize > 1 ? (row / (gridSize - 1)) * 100 : 0;

  return (
    <div
      data-tile-index={index}
      onPointerDown={(e) => !disabled && onPointerDown(index, e)}
      className={`relative select-none transition-all duration-300 ease-out flex items-center justify-center ${
        isCorrect 
          ? 'z-0 p-0 border-0 rounded-none' 
          : 'z-10 p-[2px]' 
      }`}
      style={{ touchAction: 'none' }}
    >
      <div
        className={`w-full h-full transition-all duration-500 overflow-hidden shadow-sm ${
          isDragging 
            ? 'opacity-20 grayscale scale-90' 
            : isTarget 
              ? 'ring-4 ring-indigo-500 ring-inset z-20 brightness-125' 
              : isCorrect 
                ? 'shadow-none border-transparent' 
                : 'rounded-md border-2 border-slate-800/80 hover:border-indigo-500/50 hover:shadow-lg'
        }`}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: `${gridSize * 100}%`,
          backgroundPosition: `${bgPosX}% ${bgPosY}%`,
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
