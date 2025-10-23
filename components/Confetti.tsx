import React from 'react';

const CONFETTI_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'];
const CONFETTI_COUNT = 150;

const Confetti: React.FC = () => {
  const confettiPieces = React.useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }).map((_, index) => ({
      id: index,
      style: {
        left: `${Math.random() * 100}%`,
        backgroundColor: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        animation: `confetti-fall ${3 + Math.random() * 4}s linear ${Math.random() * 5}s forwards, confetti-spin ${1 + Math.random() * 2}s linear ${Math.random() * 2}s infinite`,
        opacity: 0,
        transform: 'translateY(-100%)',
      },
    }));
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100]" aria-hidden="true">
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className="absolute w-2 h-4 rounded-sm"
          style={piece.style}
        />
      ))}
    </div>
  );
};

export default Confetti;
