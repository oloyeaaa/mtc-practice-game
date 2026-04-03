import { Monster } from './types';

const NAMES = [
  'Slimey', 'Grumblo', 'Chomper', 'Zappy', 'Fangsworth', 'Blobulus',
  'Snarlix', 'Crumbly', 'Gloomp', 'Rattlefang', 'Sizzleclaw', 'Bonkus',
  'Thudwick', 'Munchkin', 'Gritface', 'Wobblox', 'Snaptooth', 'Dustmite',
  'Rumblor', 'Flickfang', 'Goopster', 'Crackjaw', 'Stompex', 'Scorchling',
  'Frostbyte', 'Shadowmaw', 'Blazetooth', 'Thundernub',
];

const COLORS: [string, string][] = [
  ['#ef4444', '#b91c1c'], ['#f97316', '#c2410c'], ['#eab308', '#a16207'],
  ['#22c55e', '#15803d'], ['#14b8a6', '#0f766e'], ['#3b82f6', '#1d4ed8'],
  ['#8b5cf6', '#6d28d9'], ['#ec4899', '#be185d'], ['#6366f1', '#4338ca'],
  ['#f43f5e', '#be123c'],
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomMonster(level: number): Monster {
  const name = pick(NAMES);
  const [c1, c2] = pick(COLORS);
  const hp = 3 + Math.floor(level / 2);
  const isBoss = level % 5 === 0;

  return {
    name: isBoss ? `BOSS: ${name}` : name,
    c1,
    c2,
    hp,
    maxHp: hp,
    level,
    isBoss,
  };
}
