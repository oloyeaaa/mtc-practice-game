import { Rarity, RarityName, PetTemplate, Egg, Pet } from './types';

export const RARITIES: Rarity[] = [
  { name: 'Common', color: '#9ca3af', chance: 0.5 },
  { name: 'Uncommon', color: '#4ade80', chance: 0.25 },
  { name: 'Rare', color: '#38bdf8', chance: 0.15 },
  { name: 'Epic', color: '#a855f7', chance: 0.08 },
  { name: 'Legendary', color: '#fbbf24', chance: 0.02 },
];

export const PET_POOL: Record<RarityName, PetTemplate[]> = {
  Common: [
    { icon: '🐭', name: 'Mouse', bonus: 1.05 },
    { icon: '🐰', name: 'Bunny', bonus: 1.05 },
    { icon: '🐤', name: 'Chick', bonus: 1.05 },
    { icon: '🐸', name: 'Frog', bonus: 1.05 },
    { icon: '🐢', name: 'Turtle', bonus: 1.05 },
  ],
  Uncommon: [
    { icon: '🐱', name: 'Cat', bonus: 1.1 },
    { icon: '🐶', name: 'Dog', bonus: 1.1 },
    { icon: '🐼', name: 'Panda', bonus: 1.1 },
    { icon: '🐨', name: 'Koala', bonus: 1.1 },
  ],
  Rare: [
    { icon: '🦁', name: 'Lion', bonus: 1.2 },
    { icon: '🦅', name: 'Eagle', bonus: 1.2 },
    { icon: '🐋', name: 'Whale', bonus: 1.2 },
  ],
  Epic: [
    { icon: '🦄', name: 'Unicorn', bonus: 1.35 },
    { icon: '🐉', name: 'Dragon', bonus: 1.35 },
  ],
  Legendary: [
    { icon: '🔥', name: 'Phoenix', bonus: 1.5 },
    { icon: '⭐', name: 'Star Beast', bonus: 1.5 },
  ],
};

export const EGGS: Egg[] = [
  { name: 'Basic Egg', price: 50, colors: ['#94a3b8', '#64748b'], weights: [0.55, 0.30, 0.12, 0.03, 0] },
  { name: 'Rare Egg', price: 150, colors: ['#38bdf8', '#0284c7'], weights: [0.20, 0.35, 0.30, 0.13, 0.02] },
  { name: 'Epic Egg', price: 400, colors: ['#a855f7', '#7c3aed'], weights: [0.05, 0.15, 0.35, 0.35, 0.10] },
  { name: 'Legendary Egg', price: 1000, colors: ['#fbbf24', '#d97706'], weights: [0, 0.05, 0.20, 0.40, 0.35] },
];

export function rollPet(egg: Egg): Pet {
  let r = Math.random();
  let cum = 0;
  let ri = 0;
  for (let i = 0; i < egg.weights.length; i++) {
    cum += egg.weights[i];
    if (r < cum) { ri = i; break; }
  }
  const rar = RARITIES[ri];
  const pool = PET_POOL[rar.name];
  const p = pool[Math.floor(Math.random() * pool.length)];
  return {
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    icon: p.icon,
    name: p.name,
    rarity: rar.name,
    rarityColor: rar.color,
    bonus: p.bonus,
  };
}
