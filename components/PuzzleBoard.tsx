
import React, { useState, useRef } from 'react';
import { TileData } from '../types';
import Tile from './Tile';

interface PuzzleBoardProps {
  tiles: TileData[];
  gridSize: number;
  imageUrl: string;
  showNumbers: boolean;
  onSwap: (fromIndex: number, toIndex: number) => void;
  disabled: boolean;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  tiles,
  gridSize,
  imageUrl,
  showNumbers,
  onSwap,
  disabled
}) => {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [targetIdx, setTargetIdx] = useState<number | null>(null);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (index: number, e: React.PointerEvent) => {
    if (disabled) return;
    setDraggedIdx(index);
    setPointerPos({ x: e.clientX, y: e.clientY });
    
    if (e.target instanceof Element) {
      e.target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggedIdx === null) return;

    setPointerPos({ x: e.clientX, y: e.clientY });

    const element = document.elementFromPoint(e.clientX, e.clientY);
    const tileElement = element?.closest('[data-tile-index]');
    
    if (tileElement) {
      const index = parseInt(tileElement.getAttribute('data-tile-index') || '', 10);
      if (!isNaN(index) && index !== draggedIdx) {
        setTargetIdx(index);
      } else {
        setTargetIdx(null);
      }
    } else {
      setTargetIdx(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedIdx !== null) {
      if (targetIdx !== null && draggedIdx !== targetIdx) {
        onSwap(draggedIdx, targetIdx);
      }
      if (e.target instanceof Element) {
        e.target.releasePointerCapture(e.pointerId);
      }
    }
    setDraggedIdx(null);
    setTargetIdx(null);
  };

  return (
    <div 
      ref={boardRef}
      className="grid bg-slate-900 p-1.5 rounded-2xl shadow-2xl border border-slate-800 select-none touch-none relative overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        width: 'min(90vw, 500px)',
        height: 'min(90vw, 500px)',
        gap: '0px' // إزالة الفجوات للسماح بالالتحام
      }}
    >
      {tiles.map((tile, index) => (
        <Tile
          key={tile.id}
          index={index}
          tile={tile}
          gridSize={gridSize}
          imageUrl={imageUrl}
          showNumbers={showNumbers}
          disabled={disabled}
          isDragging={draggedIdx === index}
          isTarget={targetIdx === index}
          onPointerDown={handlePointerDown}
        />
      ))}

      {draggedIdx !== null && (
        <div 
          className="fixed pointer-events-none z-50 rounded-lg border-2 border-indigo-400 shadow-2xl opacity-90 scale-110"
          style={{
            left: pointerPos.x - 45,
            top: pointerPos.y - 45,
            width: '90px',
            height: '90px',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${gridSize * 100}%`,
            backgroundPosition: `${(tiles[draggedIdx].originalIndex % gridSize / (gridSize - 1)) * 100}% ${(Math.floor(tiles[draggedIdx].originalIndex / gridSize) / (gridSize - 1)) * 100}%`,
          }}
        />
      )}
    </div>
  );
};

export default PuzzleBoard;
