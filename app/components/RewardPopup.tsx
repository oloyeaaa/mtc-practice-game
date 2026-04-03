'use client';

import { useGame } from '../lib/GameContext';

export default function RewardPopup() {
  const { state, closeReward } = useGame();
  if (!state.reward) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] min-w-[260px] text-center p-6 rounded-2xl border-3 border-amber-400 animate-pop-in" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', boxShadow: '0 0 50px rgba(251,191,36,0.3)' }}>
      <div className="font-black text-xl text-amber-400 mb-2">{state.reward.name} Defeated!</div>
      <div className="text-lg text-amber-300 my-1.5">🪙 +{state.reward.coins} coins</div>
      <div className="text-sm text-green-400">+XP earned!</div>
      <button onClick={closeReward} className="mt-3 px-5 py-2 rounded-xl font-black text-sm bg-gradient-to-b from-green-500 to-green-700 text-white">
        Continue
      </button>
    </div>
  );
}
