'use client';

import { useGame } from '../lib/GameContext';

const WORLD_NAMES: Record<string, string> = {
  times: 'Times Table Tower',
  shapes: 'Shape Arena',
  placevalue: 'Place Value Planet',
  roman: 'Roman Ruins',
  fractions: 'Fraction Forest',
  mtc: 'MTC Test',
};

export default function RoundResultScreen() {
  const { state, startBattle, goMenu } = useGame();
  const b = state.battle;
  const total = b.results.length;
  const pct = total > 0 ? (b.roundCorrect / total) * 100 : 0;

  let msg = '';
  if (pct === 100) msg = 'PERFECT! You are a LEGEND!';
  else if (pct >= 90) msg = 'Amazing! Almost perfect!';
  else if (pct >= 75) msg = 'Great work! Keep it up!';
  else if (pct >= 50) msg = 'Good effort! Practice the tricky ones!';
  else msg = 'Keep going! Every battle makes you stronger!';
  if (b.bestStreak >= 5) msg += ` Best streak: ${b.bestStreak}!`;

  const wrongs = b.results.filter(r => !r.isCorrect);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen px-5 overflow-y-auto" style={{ background: 'linear-gradient(180deg, #0c0c1d, #1a0a2e)' }}>
      <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-5 text-center max-w-[380px] w-full">
        <h2 className="font-black text-2xl text-amber-400 mb-1">
          {WORLD_NAMES[b.world] || 'Round'} Complete!
        </h2>

        <div className="text-5xl font-black">
          {b.roundCorrect}<span className="text-slate-500 text-2xl"> / {total}</span>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-5 my-2.5">
          <Stat value={b.roundCorrect} label="Correct" color="text-green-400" />
          <Stat value={b.roundWrong} label="Wrong" color="text-red-500" />
          <Stat value={b.roundCoins} label="Coins" color="text-amber-400" />
          <Stat value={b.roundXP} label="XP" color="text-cyan-400" />
        </div>

        <p className="text-sm text-slate-300 my-2 leading-snug">{msg}</p>

        {/* Wrong answers */}
        {wrongs.length > 0 && (
          <div className="text-left bg-red-500/[0.08] border border-red-500/20 rounded-xl p-2.5 mt-2.5">
            <h4 className="text-red-500 text-[0.8rem] font-bold mb-1">Practise these:</h4>
            {wrongs.map((r, i) => (
              <div key={i} className="flex justify-between py-0.5 text-sm text-gray-300">
                <span>{r.qLabel}</span>
                <span>
                  {r.timedOut ? (
                    <span className="text-amber-400">timed out</span>
                  ) : (
                    <span className="line-through text-red-500">{r.given}</span>
                  )}
                  {' \u2192 '}
                  <span className="text-green-400 font-bold">{r.answer}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 justify-center mt-3.5 flex-wrap">
          <button
            onClick={() => startBattle(b.world)}
            className="px-5 py-2.5 rounded-xl font-black text-sm bg-gradient-to-b from-red-500 to-red-700 text-white active:scale-95 transition-all"
            style={{ boxShadow: '0 5px 0 #991b1b' }}
          >
            Play Again
          </button>
          <button
            onClick={goMenu}
            className="px-5 py-2.5 rounded-xl font-black text-sm bg-white/10 border-2 border-white/20 text-white active:scale-95 transition-all"
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-lg font-black ${color}`}>{value}</div>
      <div className="text-[0.65rem] text-slate-400">{label}</div>
    </div>
  );
}
