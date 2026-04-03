'use client';

import { useGame } from '../lib/GameContext';
import { WorldType } from '../lib/types';

const WORLDS: { id: WorldType; name: string; desc: string; icon: string; gradient: string; span2?: boolean }[] = [
  { id: 'times', name: 'Times Table Tower', desc: 'Multiplication battles', icon: '⚔️', gradient: 'from-red-600 to-red-800' },
  { id: 'shapes', name: 'Shape Arena', desc: 'Perimeter & Area', icon: '🔶', gradient: 'from-blue-600 to-blue-800' },
  { id: 'placevalue', name: 'Place Value Planet', desc: 'Hundreds, Tens & Ones', icon: '🔢', gradient: 'from-emerald-600 to-emerald-800' },
  { id: 'roman', name: 'Roman Ruins', desc: 'Roman Numerals', icon: '🏛️', gradient: 'from-amber-600 to-amber-700' },
  { id: 'fractions', name: 'Fraction Forest', desc: 'Fractions & Comparing', icon: '🥧', gradient: 'from-violet-600 to-violet-800' },
  { id: 'mtc', name: 'MTC Test Simulation', desc: '25 questions, 6 seconds each — just like the real test', icon: '🎯', gradient: 'from-rose-600 to-rose-700', span2: true },
];

export default function MenuScreen() {
  const { startBattle, dispatch } = useGame();

  return (
    <div className="flex flex-col items-center w-full h-screen overflow-y-auto pb-8 relative" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 40%, #334155 100%)' }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 80%, rgba(168,85,247,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(56,189,248,0.15) 0%, transparent 40%)' }} />

      <div className="relative z-10 text-center px-5 w-full max-w-[500px]">
        {/* Title */}
        <h1 className="font-black text-[2.6rem] mt-5 mb-0.5 tracking-tight" style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316, #ef4444, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>
          TIMES TABLE LEGENDS
        </h1>
        <p className="text-slate-400 text-sm mb-4">Train. Battle. Collect.</p>

        {/* Floating characters */}
        <div className="flex justify-center gap-4 mb-5">
          {['from-blue-500 to-blue-600', 'from-red-500 to-red-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600'].map((grad, i) => (
            <div key={i} className={`w-[50px] h-[50px] rounded-xl bg-gradient-to-br ${grad} shadow-lg`} style={{ animation: `charFloat 3s ease-in-out infinite ${i * 0.5}s` }}>
              <div className="flex justify-center gap-2 pt-2.5">
                <div className="w-2.5 h-3 bg-white rounded-[3px] relative"><div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-[5px] h-[5px] bg-[#1a1a2e] rounded-[2px]" /></div>
                <div className="w-2.5 h-3 bg-white rounded-[3px] relative"><div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-[5px] h-[5px] bg-[#1a1a2e] rounded-[2px]" /></div>
              </div>
              <div className="w-3.5 h-[5px] bg-[#1a1a2e] rounded-b-[5px] mx-auto mt-1" />
            </div>
          ))}
        </div>

        <div className="text-[0.8rem] text-slate-500 uppercase tracking-[2px] font-black mb-2">Choose Your World</div>

        {/* World grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          {WORLDS.map(w => (
            <button
              key={w.id}
              onClick={() => startBattle(w.id)}
              className={`bg-gradient-to-br ${w.gradient} rounded-[14px] p-3.5 text-center border-2 border-transparent hover:border-white/30 active:scale-[0.96] transition-all relative overflow-hidden ${w.span2 ? 'col-span-2' : ''}`}
            >
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-[12px] pointer-events-none" />
              <div className="text-2xl mb-1">{w.icon}</div>
              <div className="text-[0.9rem] font-black">{w.name}</div>
              <div className="text-[0.65rem] text-white/60 mt-0.5">{w.desc}</div>
            </button>
          ))}
        </div>

        {/* Bottom buttons */}
        <div className="flex gap-2.5 justify-center flex-wrap">
          <MenuBtn label="🥚 Shop" gradient="from-purple-500 to-violet-600" shadow="#6d28d9" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'shop' })} />
          <MenuBtn label="🐾 Pets" gradient="from-green-500 to-green-700" shadow="#166534" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'pets' })} />
          <MenuBtn label="🏆 Achievements" gradient="from-amber-500 to-amber-600" shadow="#b45309" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'achievements' })} />
        </div>
      </div>
    </div>
  );
}

function MenuBtn({ label, gradient, shadow, onClick }: { label: string; gradient: string; shadow: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wide bg-gradient-to-b ${gradient} text-white relative overflow-hidden active:scale-[0.96] active:translate-y-[3px] transition-all`}
      style={{ boxShadow: `0 5px 0 ${shadow}` }}
    >
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/12 to-transparent rounded-t-xl pointer-events-none" />
      {label}
    </button>
  );
}
