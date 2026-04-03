'use client';

import { useGame } from '../lib/GameContext';

const RARITY_ORDER: Record<string, number> = { Legendary: 0, Epic: 1, Rare: 2, Uncommon: 3, Common: 4 };
const RARITY_COLORS: Record<string, string> = {
  Common: 'text-gray-400',
  Uncommon: 'text-green-400',
  Rare: 'text-sky-400',
  Epic: 'text-purple-500',
  Legendary: 'text-amber-400',
};

export default function PetsScreen() {
  const { state, goMenu, equipPet } = useGame();
  const pets = [...state.game.pets].sort((a, b) => (RARITY_ORDER[a.rarity] ?? 5) - (RARITY_ORDER[b.rarity] ?? 5));
  const equipped = state.game.pets.find(p => p.id === state.game.equippedPet);

  return (
    <div className="flex flex-col items-center w-full h-screen pt-[68px] overflow-y-auto" style={{ background: 'linear-gradient(180deg, #052e16, #14532d)' }}>
      <button onClick={goMenu} className="fixed top-[7px] left-[7px] z-[150] bg-black/50 border-2 border-white/20 rounded-xl text-white text-[1.1rem] px-3 py-1 font-black">\u2190</button>

      <h2 className="font-black text-3xl text-green-400 mt-2 mb-1">My Pets</h2>
      <p className="text-green-300 text-sm mb-2.5">
        {equipped ? `Equipped: ${equipped.name} (x${equipped.bonus} coins)` : 'Tap a pet to equip it'}
      </p>

      <div className="grid grid-cols-3 gap-2.5 px-5 pb-24 w-full max-w-[420px]">
        {pets.length === 0 && (
          <p className="col-span-3 text-center text-green-300 py-8">No pets yet! Buy eggs in the shop.</p>
        )}
        {pets.map(pet => (
          <button
            key={pet.id}
            onClick={() => equipPet(pet.id)}
            className={`bg-white/[0.06] border-2 rounded-xl py-2.5 px-1.5 text-center transition-all hover:border-white/30 ${
              state.game.equippedPet === pet.id ? 'border-amber-400 bg-amber-400/10' : 'border-white/10'
            }`}
          >
            <div className="text-[2.2rem] mb-0.5">{pet.icon}</div>
            <div className="text-[0.7rem] font-bold">{pet.name}</div>
            <div className={`text-[0.6rem] font-black uppercase ${RARITY_COLORS[pet.rarity] || 'text-gray-400'}`}>{pet.rarity}</div>
            <div className="text-[0.6rem] text-amber-400 mt-0.5">x{pet.bonus} coins</div>
          </button>
        ))}
      </div>
    </div>
  );
}
