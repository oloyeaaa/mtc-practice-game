import { Achievement, GameState } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  // ── Battle ──
  { id: 'first_blood', name: 'First Blood', description: 'Get your first correct answer', icon: '⚔️', category: 'battle',
    check: (s) => s.stats.totalCorrect >= 1 },
  { id: 'streak_5', name: 'On Fire', description: 'Get a 5 answer streak', icon: '🔥', category: 'battle',
    check: (s) => s.stats.bestStreak >= 5 },
  { id: 'streak_10', name: 'Unstoppable', description: 'Get a 10 answer streak', icon: '💥', category: 'battle',
    check: (s) => s.stats.bestStreak >= 10 },
  { id: 'streak_25', name: 'Perfect Storm', description: 'Get a 25 answer streak', icon: '⚡', category: 'battle',
    check: (s) => s.stats.bestStreak >= 25 },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Answer in under 1 second', icon: '⏱️', category: 'battle',
    check: (s) => s.stats.fastestAnswer < 1 },
  { id: 'lightning', name: 'Lightning Fast', description: 'Answer in under 0.5 seconds', icon: '⚡', category: 'battle',
    check: (s) => s.stats.fastestAnswer < 0.5 },
  { id: 'monster_slayer', name: 'Monster Slayer', description: 'Defeat 10 monsters', icon: '🗡️', category: 'battle',
    check: (s) => s.monstersDefeated >= 10 },
  { id: 'monster_hunter', name: 'Monster Hunter', description: 'Defeat 50 monsters', icon: '👹', category: 'battle',
    check: (s) => s.monstersDefeated >= 50 },
  { id: 'boss_basher', name: 'Boss Basher', description: 'Defeat 100 monsters', icon: '💀', category: 'battle',
    check: (s) => s.monstersDefeated >= 100 },

  // ── Mastery ──
  { id: 'perfect_round', name: 'Flawless', description: 'Complete a round with no mistakes', icon: '🏆', category: 'mastery',
    check: (s) => s.stats.perfectRounds >= 1 },
  { id: 'perfect_5', name: 'Perfectionist', description: 'Get 5 perfect rounds', icon: '🌟', category: 'mastery',
    check: (s) => s.stats.perfectRounds >= 5 },
  { id: 'mtc_master', name: 'MTC Master', description: 'Score 25/25 on MTC Test', icon: '🎯', category: 'mastery',
    check: (s) => s.stats.mtcBestScore >= 25 },
  { id: 'mtc_regular', name: 'MTC Regular', description: 'Complete 10 MTC Tests', icon: '📝', category: 'mastery',
    check: (s) => s.stats.mtcGamesPlayed >= 10 },
  { id: 'correct_100', name: 'Century', description: 'Get 100 total correct answers', icon: '💯', category: 'mastery',
    check: (s) => s.stats.totalCorrect >= 100 },
  { id: 'correct_500', name: 'Maths Wizard', description: 'Get 500 total correct answers', icon: '🧙', category: 'mastery',
    check: (s) => s.stats.totalCorrect >= 500 },
  { id: 'correct_1000', name: 'Maths Legend', description: 'Get 1000 total correct answers', icon: '👑', category: 'mastery',
    check: (s) => s.stats.totalCorrect >= 1000 },
  { id: 'games_10', name: 'Dedicated', description: 'Play 10 games', icon: '🎮', category: 'mastery',
    check: (s) => s.stats.totalGames >= 10 },
  { id: 'games_50', name: 'Committed', description: 'Play 50 games', icon: '💪', category: 'mastery',
    check: (s) => s.stats.totalGames >= 50 },

  // ── Collection ──
  { id: 'first_pet', name: 'Pet Owner', description: 'Hatch your first pet', icon: '🥚', category: 'collection',
    check: (s) => s.pets.length >= 1 },
  { id: 'pet_collector', name: 'Pet Collector', description: 'Collect 5 pets', icon: '🐾', category: 'collection',
    check: (s) => s.pets.length >= 5 },
  { id: 'pet_hoarder', name: 'Pet Hoarder', description: 'Collect 15 pets', icon: '🏠', category: 'collection',
    check: (s) => s.pets.length >= 15 },
  { id: 'rare_find', name: 'Rare Find', description: 'Hatch a Rare pet', icon: '💎', category: 'collection',
    check: (s) => s.pets.some(p => p.rarity === 'Rare' || p.rarity === 'Epic' || p.rarity === 'Legendary') },
  { id: 'epic_find', name: 'Epic Discovery', description: 'Hatch an Epic pet', icon: '🚀', category: 'collection',
    check: (s) => s.pets.some(p => p.rarity === 'Epic' || p.rarity === 'Legendary') },
  { id: 'legendary_find', name: 'Legendary!', description: 'Hatch a Legendary pet', icon: '⭐', category: 'collection',
    check: (s) => s.pets.some(p => p.rarity === 'Legendary') },

  // ── Milestones ──
  { id: 'level_5', name: 'Rising Star', description: 'Reach Level 5', icon: '⭐', category: 'milestone',
    check: (s) => s.level >= 5 },
  { id: 'level_10', name: 'Getting Strong', description: 'Reach Level 10', icon: '🌟', category: 'milestone',
    check: (s) => s.level >= 10 },
  { id: 'level_25', name: 'Elite', description: 'Reach Level 25', icon: '👑', category: 'milestone',
    check: (s) => s.level >= 25 },
  { id: 'coins_500', name: 'Coin Collector', description: 'Earn 500 total coins', icon: '🪙', category: 'milestone',
    check: (s) => s.stats.totalCoinsEarned >= 500 },
  { id: 'coins_5000', name: 'Rich!', description: 'Earn 5000 total coins', icon: '💰', category: 'milestone',
    check: (s) => s.stats.totalCoinsEarned >= 5000 },
  { id: 'all_worlds', name: 'Explorer', description: 'Play every world at least once', icon: '🌍', category: 'milestone',
    check: (s) => {
      const worlds = ['times', 'shapes', 'placevalue', 'roman', 'fractions', 'mtc'];
      return worlds.every(w => (s.stats.worldsPlayed[w] || 0) >= 1);
    }},
];

export function checkAchievements(state: GameState): string[] {
  const newlyUnlocked: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (!state.achievements[ach.id] && ach.check(state)) {
      state.achievements[ach.id] = true;
      newlyUnlocked.push(ach.id);
    }
  }
  return newlyUnlocked;
}

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}
