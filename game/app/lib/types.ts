// ═══ Core Game Types ═══

export interface GameState {
  coins: number;
  gems: number;
  xp: number;
  level: number;
  xpToNext: number;
  pets: Pet[];
  equippedPet: string | null;
  monstersDefeated: number;
  stats: GameStats;
  achievements: Record<string, boolean>;
}

export interface GameStats {
  totalCorrect: number;
  totalWrong: number;
  totalGames: number;
  perfectRounds: number;
  bestStreak: number;
  totalCoinsEarned: number;
  totalXPEarned: number;
  fastestAnswer: number; // seconds
  tablesMastery: Record<number, { correct: number; wrong: number }>;
  worldsPlayed: Record<string, number>;
  mtcBestScore: number;
  mtcGamesPlayed: number;
}

export interface Pet {
  id: string;
  icon: string;
  name: string;
  rarity: RarityName;
  rarityColor: string;
  bonus: number;
}

export type RarityName = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

export interface Rarity {
  name: RarityName;
  color: string;
  chance: number;
}

export interface PetTemplate {
  icon: string;
  name: string;
  bonus: number;
}

export interface Egg {
  name: string;
  price: number;
  colors: [string, string];
  weights: number[];
}

export interface Monster {
  name: string;
  c1: string;
  c2: string;
  hp: number;
  maxHp: number;
  level: number;
  isBoss: boolean;
}

export type QuestionType = 'number' | 'compare' | 'choice';
export type WorldType = 'times' | 'mtc' | 'shapes' | 'placevalue' | 'roman' | 'fractions';

export interface Question {
  type: QuestionType;
  text: string;
  answer: number | string;
  explain: string;
  qLabel: string;
  choices?: string[];
  shape?: ShapeData;
  pv?: { h: number; t: number; o: number };
  frac?: { num: number; den: number };
  fracCompare?: { a: number; b: number; den: number };
}

export interface ShapeData {
  type: 'rect' | 'lshape' | 'compound';
  w?: number;
  h?: number;
  ow?: number;
  oh?: number;
  cw?: number;
  ch?: number;
  w1?: number;
  h1?: number;
  w2?: number;
  h2?: number;
}

export interface BattleResult {
  qLabel: string;
  answer: number | string;
  given: number | string | null;
  isCorrect: boolean;
  timedOut: boolean;
  timeTaken: number;
  explain: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'battle' | 'mastery' | 'collection' | 'milestone';
  check: (state: GameState) => boolean;
}
