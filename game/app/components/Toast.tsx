'use client';

import { useEffect } from 'react';
import { useGame } from '../lib/GameContext';

export default function ToastContainer() {
  const { state, dispatch } = useGame();

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[400] flex flex-col gap-2 w-[90%] max-w-[340px]">
      {state.toasts.map(toast => (
        <ToastItem key={toast.id} id={toast.id} icon={toast.icon} title={toast.title} subtitle={toast.subtitle} color={toast.color} onDone={() => dispatch({ type: 'REMOVE_TOAST', id: toast.id })} />
      ))}
    </div>
  );
}

function ToastItem({ id, icon, title, subtitle, color, onDone }: {
  id: string; icon: string; title: string; subtitle: string; color: string; onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [id, onDone]);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 animate-slide-in backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, rgba(0,0,0,0.85), rgba(0,0,0,0.7))`,
        borderColor: color,
        boxShadow: `0 0 20px ${color}40`,
      }}
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-black text-sm" style={{ color }}>
          {title}
        </div>
        <div className="text-xs text-gray-300 truncate">{subtitle}</div>
      </div>
      <span className="text-lg" style={{ color }}>&#x2713;</span>
    </div>
  );
}
