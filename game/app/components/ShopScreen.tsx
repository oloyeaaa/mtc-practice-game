'use client';

import { useState } from 'react';
import { useGame } from '../lib/GameContext';
import { EGGS } from '../lib/pets';
import { Pet } from '../lib/types';

export default function ShopScreen() {
  const { state, goMenu, buyEgg } = useGame();
  const [hatching, setHatching] = useState<{ pet: Pet; egg: typeof EGGS[0] } | null>(null);

  const handleBuy = (idx: number) => {
    const egg = EGGS[idx];
    if (state.game.coins < egg.price) return;
    const pet = buyEgg(idx);
    if (pet) setHatching({ pet, egg });
  };

  return (
    <div className="flex flex-col items-center w-full h-screen pt-[68px] overflow-y-auto" style={{ background: 'linear-gradient(180deg, #1a0533, #2d1055)' }}>
      <button onClick={goMenu} className="fixed top-[7px] left-[7px] z-[150] bg-black/50 border-2 border-white/20 rounded-xl text-white text-[1.1rem] px-3 py-1 font-black">\u2190</button>

      <h2 className="font-black text-3xl text-purple-500 mt-2 mb-1">Egg Shop</h2>
      <p className="text-purple-300 text-sm mb-2">Hatch pets to boost your coins!</p>

      <div className="grid grid-cols-2 gap-3 px-5 pb-24 w-full max-w-[420px]">
        {EGGS.map((egg, i) => {
          const canBuy = state.game.coins >= egg.price;
          return (
            <button
              key={i}
              onClick={() => handleBuy(i)}
              className={`bg-white/[0.06] border-2 border-white/10 rounded-[14px] p-3.5 text-center transition-all ${canBuy ? 'hover:border-purple-500/50 hover:-translate-y-0.5 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
            >
              <div className="w-14 h-[68px] mx-auto mb-1.5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${egg.colors[0]}, ${egg.colors[1]})` }}>
                <div className="absolute top-2 left-2.5 w-3 h-[18px] bg-white/25 rounded-full -rotate-[20deg]" />
              </div>
              <div className="font-black text-[0.9rem] mb-0.5">{egg.name}</div>
              <div className="text-sm text-amber-400">🪙 {egg.price}</div>
            </button>
          );
        })}
      </div>

      {/* Hatch overlay */}
      {hatching && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[300] flex-col">
          <div className="w-[90px] h-[110px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] animate-hatch-shake" style={{ background: `linear-gradient(135deg, ${hatching.egg.colors[0]}, ${hatching.egg.colors[1]})` }} />
          <div className="text-[4.5rem] mt-4 animate-hatch-reveal">{hatching.pet.icon}</div>
          <div className="font-black text-xl mt-2 animate-hatch-reveal-delay" style={{ color: hatching.pet.rarityColor }}>{hatching.pet.rarity}!</div>
          <div className="text-gray-300 animate-hatch-reveal-delay2">{hatching.pet.name}</div>
          <button onClick={() => setHatching(null)} className="mt-4 px-5 py-2 rounded-xl font-black text-sm bg-gradient-to-b from-green-500 to-green-700 text-white animate-hatch-reveal-delay3">
            Awesome!
          </button>
        </div>
      )}
    </div>
  );
}
