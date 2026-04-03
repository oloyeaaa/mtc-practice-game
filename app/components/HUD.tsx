'use client';

import { useGame } from '../lib/GameContext';

export default function HUD() {
  const { state } = useGame();
  const g = state.game;
  const pct = Math.min(100, (g.xp / g.xpToNext) * 100);

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-4 py-2" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
        <div className="flex items-center gap-2.5">
          <HudItem icon="🪙" value={g.coins} color="#ffd700" />
          <HudItem icon="💎" value={g.gems} color="#a78bfa" />
        </div>
        <div className="flex items-center gap-2.5">
          {state.battle.active && state.battle.streak >= 2 && (
            <div className="font-black text-yellow-400 text-sm animate-pulse">
              🔥 {state.battle.streak}x
            </div>
          )}
        </div>
      </div>

      {/* XP bar */}
      <div className="fixed top-[42px] left-4 right-4 z-[100] flex items-center gap-2">
        <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[0.8rem] font-black border-2 border-white" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', boxShadow: '0 0 10px rgba(245,158,11,0.5)' }}>
          {g.level}
        </div>
        <div className="flex-1 h-[9px] rounded-md border border-white/10 overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="h-full rounded-md transition-all duration-500" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #4ade80, #22d3ee)' }} />
        </div>
        <div className="text-[0.7rem] text-gray-400 whitespace-nowrap">
          {g.xp}/{g.xpToNext} XP
        </div>
      </div>
    </>
  );
}

function HudItem({ icon, value, color }: { icon: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1 bg-black/50 border-2 border-white/15 rounded-full px-3 py-0.5 text-[0.85rem] font-black">
      <span className="text-[1.1rem]">{icon}</span>
      <span style={{ color }}>{value}</span>
    </div>
  );
}
