'use client';

import { useEffect } from 'react';
import { useGame } from '../lib/GameContext';

export default function LevelUpOverlay() {
  const { state, dispatch } = useGame();

  useEffect(() => {
    if (state.showLevelUp) {
      const t = setTimeout(() => dispatch({ type: 'LEVEL_UP_END' }), 2000);
      return () => clearTimeout(t);
    }
  }, [state.showLevelUp, dispatch]);

  if (!state.showLevelUp) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[250] flex-col">
      <div className="font-black text-4xl animate-pop-in" style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        LEVEL UP!
      </div>
      <div className="font-black text-6xl text-white mt-2 animate-pop-in-delay" style={{ textShadow: '0 0 40px rgba(251,191,36,0.6)' }}>
        {state.levelUpNum}
      </div>
    </div>
  );
}
