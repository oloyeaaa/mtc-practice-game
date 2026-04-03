'use client';

import { useGame } from '../lib/GameContext';
import { ACHIEVEMENTS } from '../lib/achievements';

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  battle: { label: 'Battle', color: '#ef4444' },
  mastery: { label: 'Mastery', color: '#a855f7' },
  collection: { label: 'Collection', color: '#22c55e' },
  milestone: { label: 'Milestones', color: '#fbbf24' },
};

const CATEGORIES = ['battle', 'mastery', 'collection', 'milestone'] as const;

export default function AchievementsScreen() {
  const { state, goMenu } = useGame();
  const unlocked = state.game.achievements;
  const totalUnlocked = Object.values(unlocked).filter(Boolean).length;

  return (
    <div className="flex flex-col items-center w-full h-screen pt-[68px] overflow-y-auto pb-8" style={{ background: 'linear-gradient(180deg, #1a1005, #2d1a08)' }}>
      <button onClick={goMenu} className="fixed top-[7px] left-[7px] z-[150] bg-black/50 border-2 border-white/20 rounded-xl text-white text-[1.1rem] px-3 py-1 font-black">\u2190</button>

      <h2 className="font-black text-3xl text-amber-400 mt-2 mb-1">🏆 Achievements</h2>
      <p className="text-amber-200/60 text-sm mb-4">{totalUnlocked} / {ACHIEVEMENTS.length} unlocked</p>

      {/* Progress bar */}
      <div className="w-[80%] max-w-[350px] h-3 bg-black/40 rounded-full border border-white/10 overflow-hidden mb-5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(totalUnlocked / ACHIEVEMENTS.length) * 100}%`,
            background: 'linear-gradient(90deg, #fbbf24, #f97316)',
          }}
        />
      </div>

      <div className="w-full max-w-[420px] px-5">
        {CATEGORIES.map(cat => {
          const catAchs = ACHIEVEMENTS.filter(a => a.category === cat);
          const catInfo = CATEGORY_LABELS[cat];
          return (
            <div key={cat} className="mb-5">
              <h3 className="font-black text-sm uppercase tracking-wider mb-2" style={{ color: catInfo.color }}>
                {catInfo.label}
              </h3>
              <div className="grid gap-2">
                {catAchs.map(ach => {
                  const isUnlocked = !!unlocked[ach.id];
                  return (
                    <div
                      key={ach.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        isUnlocked
                          ? 'bg-white/[0.08] border-white/20'
                          : 'bg-black/20 border-white/[0.05] opacity-50'
                      }`}
                    >
                      <div className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                        {isUnlocked ? ach.icon : '🔒'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm">
                          {isUnlocked ? ach.name : '???'}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {ach.description}
                        </div>
                      </div>
                      {isUnlocked && (
                        <span className="text-green-400 text-lg">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats summary */}
      <div className="w-full max-w-[420px] px-5 mt-4">
        <h3 className="font-black text-sm uppercase tracking-wider mb-2 text-cyan-400">Your Stats</h3>
        <div className="bg-white/[0.06] border-2 border-white/10 rounded-xl p-4 grid grid-cols-2 gap-3">
          <StatRow label="Total Correct" value={state.game.stats.totalCorrect} />
          <StatRow label="Total Games" value={state.game.stats.totalGames} />
          <StatRow label="Perfect Rounds" value={state.game.stats.perfectRounds} />
          <StatRow label="Best Streak" value={state.game.stats.bestStreak} />
          <StatRow label="Monsters Defeated" value={state.game.monstersDefeated} />
          <StatRow label="Total Coins Earned" value={state.game.stats.totalCoinsEarned} />
          <StatRow label="MTC Best Score" value={`${state.game.stats.mtcBestScore}/25`} />
          <StatRow label="Fastest Answer" value={state.game.stats.fastestAnswer === Infinity ? '-' : `${state.game.stats.fastestAnswer.toFixed(2)}s`} />
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-[0.65rem] text-gray-500 uppercase">{label}</div>
      <div className="font-black text-lg">{value}</div>
    </div>
  );
}
