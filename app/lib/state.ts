import { GameState, GameStats } from './types';

const SAVE_KEY = 'ttl_save_v4';

function defaultStats(): GameStats {
  return {
    totalCorrect: 0,
    totalWrong: 0,
    totalGames: 0,
    perfectRounds: 0,
    bestStreak: 0,
    totalCoinsEarned: 0,
    totalXPEarned: 0,
    fastestAnswer: Infinity,
    tablesMastery: {},
    worldsPlayed: {},
    mtcBestScore: 0,
    mtcGamesPlayed: 0,
  };
}

export function defaultState(): GameState {
  return {
    coins: 0,
    gems: 0,
    xp: 0,
    level: 1,
    xpToNext: 100,
    pets: [],
    equippedPet: null,
    monstersDefeated: 0,
    stats: defaultStats(),
    achievements: {},
  };
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // silently fail
  }
}

export function loadState(): GameState {
  const base = defaultState();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults so new fields are always present
      return {
        ...base,
        ...parsed,
        stats: { ...base.stats, ...(parsed.stats || {}) },
        achievements: { ...base.achievements, ...(parsed.achievements || {}) },
      };
    }
  } catch {
    // silently fail
  }
  return base;
}
