'use client';

import { useGame } from '../lib/GameContext';

export default function MonsterDisplay() {
  const { state } = useGame();
  const m = state.battle.monster;
  if (!m) return null;

  const hpPct = Math.max(0, (m.hp / m.maxHp) * 100);
  const size = m.isBoss ? 130 : 100;

  return (
    <div className="relative mb-1.5 flex flex-col items-center">
      {/* Monster body */}
      <div
        className={`relative rounded-[14px] transition-all duration-300 ${state.monsterHit ? 'animate-monster-hit' : ''} ${state.monsterDying ? 'animate-monster-die' : 'animate-monster-idle'}`}
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${m.c1}, ${m.c2})`,
          boxShadow: `0 8px 25px ${m.c1}40`,
        }}
      >
        {/* Eyes */}
        <div className="flex justify-center gap-3 pt-5">
          <Eye />
          <Eye />
        </div>
        {/* Mouth */}
        <div className="w-[34px] h-[10px] mx-auto mt-2 rounded-b-lg overflow-hidden relative">
          <div className="w-full h-full bg-[#1a1a2e] rounded-b-lg" />
          <div className="absolute top-0 left-0 right-0 flex justify-around">
            <div className="w-[5px] h-[4px] bg-white rounded-b-sm" />
            <div className="w-[5px] h-[4px] bg-white rounded-b-sm" />
            <div className="w-[5px] h-[4px] bg-white rounded-b-sm" />
          </div>
        </div>
      </div>

      {/* HP bar */}
      <div className="w-[120px] h-[10px] bg-black/60 rounded-lg border-2 border-white/20 mt-2 overflow-hidden">
        <div
          className="h-full rounded-md transition-all duration-400"
          style={{ width: `${hpPct}%`, background: 'linear-gradient(90deg, #ef4444, #f97316)' }}
        />
      </div>
      <div className="text-[0.8rem] text-gray-400 font-bold mt-0.5">{m.name}</div>
      <div className="text-[0.7rem] text-yellow-400">Level {m.level}</div>

      {/* Damage popups rendered by parent */}
    </div>
  );
}

function Eye() {
  return (
    <div className="w-[18px] h-[22px] bg-white rounded-[5px] relative overflow-hidden">
      <div className="absolute w-[10px] h-[10px] bg-[#1a1a2e] rounded-[3px] bottom-[3px] left-1/2 -translate-x-1/2" />
    </div>
  );
}
