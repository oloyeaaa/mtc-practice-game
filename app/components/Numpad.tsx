'use client';

import { useGame } from '../lib/GameContext';

export default function Numpad() {
  const { inputKey, inputDel, inputGo } = useGame();

  return (
    <div className="grid grid-cols-4 gap-[7px] px-3.5 pb-4 pt-1.5 max-w-[380px] mx-auto w-full">
      {[1, 2, 3].map(n => <NumKey key={n} value={String(n)} onClick={() => inputKey(String(n))} />)}
      <button onClick={inputDel} className="nk-btn bg-gradient-to-b from-red-500 to-red-700 shadow-[0_3px_0_#991b1b] active:shadow-[0_1px_0_#991b1b] active:translate-y-[2px] text-[0.95rem]">
        DEL
      </button>

      {[4, 5, 6].map(n => <NumKey key={n} value={String(n)} onClick={() => inputKey(String(n))} />)}
      <button onClick={inputGo} className="nk-btn bg-gradient-to-b from-green-500 to-green-700 shadow-[0_3px_0_#166534] active:shadow-[0_1px_0_#166534] active:translate-y-[2px] text-[0.95rem] row-span-2 flex items-center justify-center">
        GO!
      </button>

      {[7, 8, 9].map(n => <NumKey key={n} value={String(n)} onClick={() => inputKey(String(n))} />)}
      <div /> {/* empty cell */}
      <NumKey value="0" onClick={() => inputKey('0')} className="col-start-2" />
    </div>
  );
}

function NumKey({ value, onClick, className = '' }: { value: string; onClick: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={`nk-btn bg-gradient-to-b from-slate-700 to-slate-800 shadow-[0_3px_0_#0f172a] active:shadow-[0_1px_0_#0f172a] active:translate-y-[2px] ${className}`}>
      {value}
    </button>
  );
}
