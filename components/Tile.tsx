
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
  
  const percentX = gridSize > 1 ? (col / (gridSize - 1)) * 100 : 0;
  const percentY = gridSize > 1 ? (row / (gridSize - 1)) * 100 : 0;

  return (
    <div
      data-tile-index={index}
      onPointerDown={(e) => !disabled && onPointerDown(index, e)}
      className={`relative select-none transition-all duration-300 ease-out bg-slate-800 ${
        isDragging ? 'opacity-0' : ''
      }`}
      style={{ 
        touchAction: 'none',
        aspectRatio: '1/1'
      }}
    >
      <div
        className={`w-full h-full relative transition-all duration-500 overflow-hidden ${
          isTarget ? 'ring-4 ring-indigo-500 ring-inset z-20 brightness-125 scale-95' : ''
        } ${isCorrect ? '' : 'border-[0.5px] border-white/10'}`}
        style={{
          backgroundImage: `url("${imageUrl}")`,
          backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
          backgroundPosition: `${percentX}% ${percentY}%`,
          backgroundRepeat: 'no-repeat'
        }}
      >
        {isTarget && (
          <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />
        )}
        
        {showNumbers && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-bold text-lg drop-shadow-md">
            {tile.originalIndex + 1}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tile;
