
import React, { useEffect, useState } from 'react';

const Fireworks: React.FC = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  useEffect(() => {
    const colors = ['#818cf8', '#6366f1', '#4f46e5', '#f472b6', '#fbbf24', '#34d399'];
    const interval = setInterval(() => {
      const id = Date.now();
      const newParticle = {
        id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setParticles(prev => [...prev.slice(-20), newParticle]);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full animate-ping"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            boxShadow: `0 0 20px ${p.color}, 0 0 40px ${p.color}`,
          }}
        />
      ))}
      <style>{`
        @keyframes fireworks {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
        .animate-firework {
          animation: fireworks 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Fireworks;
