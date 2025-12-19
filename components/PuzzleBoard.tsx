
import React, { useState, useRef } from 'react';
import { TileData } from '../types.ts';
import Tile from './Tile.tsx';

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

    // تحديد المربع المستهدف تحت الإصبع
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

  const tileSize = boardRef.current ? boardRef.current.offsetWidth / gridSize : 100;

  return (
    <div 
      ref={boardRef}
      className="grid bg-slate-800 p-1.5 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] border-4 border-slate-700/50 select-none touch-none relative"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        width: 'min(94vw, 85vh, 700px)',
        height: 'min(94vw, 85vh, 700px)',
        gap: '2px' // فجوة بسيطة بين القطع تجعلها أكثر وضوحاً
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

      {/* قطعة السحب الطائرة (Ghost Tile) */}
      {draggedIdx !== null && (
        <div 
          className="fixed pointer-events-none z-50 overflow-hidden border-4 border-indigo-400 shadow-[0_40px_80px_rgba(0,0,0,0.9)] scale-110 rounded-2xl"
          style={{
            left: pointerPos.x - tileSize / 2,
            top: pointerPos.y - tileSize / 2,
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
            backgroundPosition: `${(tiles[draggedIdx].originalIndex % gridSize / (gridSize - 1)) * 100}% ${(Math.floor(tiles[draggedIdx].originalIndex / gridSize) / (gridSize - 1)) * 100}%`,
          }}
        />
      )}
    </div>
  );
};

export default PuzzleBoard;
