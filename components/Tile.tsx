
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
  
  // حساب الموقع بنسبة مئوية دقيقة لتجنب الفراغات البيضاء
  const bgPosX = gridSize > 1 ? (col / (gridSize - 1)) * 100 : 0;
  const bgPosY = gridSize > 1 ? (row / (gridSize - 1)) * 100 : 0;

  return (
    <div
      data-tile-index={index}
      onPointerDown={(e) => !disabled && onPointerDown(index, e)}
      className={`relative select-none transition-all duration-300 ease-out flex items-center justify-center bg-slate-900 ${
        isCorrect 
          ? 'z-0 p-0' 
          : 'z-10 p-[0.5px]' // تقليل الفجوة لأقل حد ممكن
      }`}
      style={{ touchAction: 'none' }}
    >
      <div
        className={`w-full h-full transition-all duration-500 overflow-hidden ${
          isDragging 
            ? 'opacity-30 scale-95 shadow-2xl' 
            : isTarget 
              ? 'ring-2 ring-indigo-500 ring-inset z-20 brightness-125' 
              : isCorrect 
                ? 'shadow-none' 
                : 'rounded-sm shadow-sm'
        }`}
        style={{
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
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
