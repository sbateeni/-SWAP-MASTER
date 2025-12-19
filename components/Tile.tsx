
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
  
  // نستخدم النسب المئوية لـ left و top لأنها تعتمد على حجم "الحاوية" (المربع)
  // بينما transform: translate تعتمد على حجم "العنصر نفسه" (الصورة الكبيرة)
  const leftOffset = -(col * 100);
  const topOffset = -(row * 100);

  return (
    <div
      data-tile-index={index}
      onPointerDown={(e) => !disabled && onPointerDown(index, e)}
      className={`relative select-none transition-all duration-300 ease-out overflow-hidden bg-slate-900 ${
        isDragging ? 'opacity-0' : ''
      }`}
      style={{ touchAction: 'none' }}
    >
      <div
        className={`w-full h-full relative transition-transform duration-500 ${
          isTarget ? 'ring-4 ring-indigo-500 ring-inset z-20 brightness-110' : ''
        } ${isCorrect ? '' : 'border-[0.2px] border-white/5'}`}
      >
        <img
          src={imageUrl}
          alt=""
          className="absolute max-w-none pointer-events-none block"
          style={{
            width: `${gridSize * 100}%`,
            height: `${gridSize * 100}%`,
            left: `${leftOffset}%`,
            top: `${topOffset}%`,
          }}
        />
        
        {isTarget && (
          <div className="absolute inset-0 bg-indigo-500/20 animate-pulse pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default Tile;
