'use client';

interface PlaceValueProps {
  pv: { h: number; t: number; o: number };
}

export function PlaceValueDisplay({ pv }: PlaceValueProps) {
  return (
    <div className="flex justify-center gap-3 my-1.5">
      <PVColumn label="Hundreds" count={pv.h} value="100" color="bg-red-500" />
      <PVColumn label="Tens" count={pv.t} value="10" color="bg-amber-500" />
      <PVColumn label="Ones" count={pv.o} value="1" color="bg-blue-500" />
    </div>
  );
}

function PVColumn({ label, count, value, color }: { label: string; count: number; value: string; color: string }) {
  return (
    <div className="text-center min-w-[60px]">
      <div className="text-[0.7rem] font-black text-gray-400 mb-1 uppercase">{label}</div>
      <div className="flex flex-wrap gap-1 justify-center min-h-[30px]">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.5rem] font-black text-white ${color}`}>
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}

interface FracBarProps {
  num: number;
  den: number;
}

export function FractionBar({ num, den }: FracBarProps) {
  return (
    <div className="flex items-center justify-center gap-4 my-2">
      <div className="flex border-2 border-white/30 rounded-md overflow-hidden h-9">
        {Array.from({ length: den }).map((_, i) => (
          <div
            key={i}
            className={`min-w-[28px] ${i < num ? 'bg-purple-500/50' : 'bg-white/[0.06]'} ${i < den - 1 ? 'border-r border-white/15' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

interface FracCompareProps {
  a: number;
  b: number;
  den: number;
}

export function FractionCompare({ a, b, den }: FracCompareProps) {
  return (
    <div className="flex items-center justify-center gap-4 my-2">
      <div>
        <div className="flex border-2 border-white/30 rounded-md overflow-hidden h-9 mb-1">
          {Array.from({ length: den }).map((_, i) => (
            <div key={i} className={`min-w-[28px] ${i < a ? 'bg-purple-500/50' : 'bg-white/[0.06]'} ${i < den - 1 ? 'border-r border-white/15' : ''}`} />
          ))}
        </div>
        <div className="text-center font-black text-[1.1rem]">{a}/{den}</div>
      </div>
      <div className="text-2xl font-black text-purple-400">?</div>
      <div>
        <div className="flex border-2 border-white/30 rounded-md overflow-hidden h-9 mb-1">
          {Array.from({ length: den }).map((_, i) => (
            <div key={i} className={`min-w-[28px] ${i < b ? 'bg-purple-500/50' : 'bg-white/[0.06]'} ${i < den - 1 ? 'border-r border-white/15' : ''}`} />
          ))}
        </div>
        <div className="text-center font-black text-[1.1rem]">{b}/{den}</div>
      </div>
    </div>
  );
}
