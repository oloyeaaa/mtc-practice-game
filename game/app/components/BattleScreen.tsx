'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useGame } from '../lib/GameContext';
import MonsterDisplay from './MonsterDisplay';
import Numpad from './Numpad';
import ShapeCanvas from './ShapeCanvas';
import { PlaceValueDisplay, FractionBar, FractionCompare } from './QuestionVisuals';

export default function BattleScreen() {
  const { state, nextQuestion, submitAnswer, inputKey, inputDel, inputGo, choiceAnswer, goMenu } = useGame();
  const b = state.battle;
  const q = b.question;
  const [timerPct, setTimerPct] = useState(100);
  const hasStarted = useRef(false);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start first question
  useEffect(() => {
    if (b.active && !hasStarted.current) {
      hasStarted.current = true;
      nextQuestion();
    }
    return () => { hasStarted.current = false; };
  }, [b.active, nextQuestion]);

  // Timer + auto-submit on timeout
  useEffect(() => {
    if (!q || b.inputLocked) {
      // Clear timers when locked
      if (timerInterval.current) { clearInterval(timerInterval.current); timerInterval.current = null; }
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
      return;
    }

    const start = Date.now();
    setTimerPct(100);

    timerInterval.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const rem = Math.max(0, 6 - elapsed);
      setTimerPct((rem / 6) * 100);
    }, 50);

    timeoutRef.current = setTimeout(() => {
      if (timerInterval.current) { clearInterval(timerInterval.current); timerInterval.current = null; }
      submitAnswer(null, true);
    }, 6000);

    return () => {
      if (timerInterval.current) { clearInterval(timerInterval.current); timerInterval.current = null; }
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    };
  }, [q, b.inputLocked, submitAnswer]);

  // Keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (b.inputLocked) return;
    if (e.key >= '0' && e.key <= '9') inputKey(e.key);
    else if (e.key === 'Backspace') inputDel();
    else if (e.key === 'Enter') inputGo();
  }, [b.inputLocked, inputKey, inputDel, inputGo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const timerColor = timerPct > 58 ? 'from-cyan-400 to-purple-400' : timerPct > 33 ? 'from-amber-400 to-orange-500' : 'from-red-500 to-red-600';

  const worldThemes: Record<string, string> = {
    times: 'linear-gradient(180deg, #1a0a2e, #0c0c1d)',
    mtc: 'linear-gradient(180deg, #1a0a2e, #0c0c1d)',
    shapes: 'linear-gradient(180deg, #0c1929, #0a1628)',
    placevalue: 'linear-gradient(180deg, #0a1f0a, #061206)',
    roman: 'linear-gradient(180deg, #1f1506, #140e04)',
    fractions: 'linear-gradient(180deg, #1a0533, #0f0320)',
  };

  return (
    <div className="flex flex-col w-full h-screen relative" style={{ background: worldThemes[b.world] || worldThemes.times }}>
      {/* Back button */}
      <button onClick={goMenu} className="fixed top-[7px] left-[7px] z-[150] bg-black/50 border-2 border-white/20 rounded-xl text-white text-[1.1rem] px-3 py-1 font-black cursor-pointer">
        {'\u2190'}
      </button>

      {/* Battle arena */}
      <div className="flex-1 flex flex-col items-center justify-start relative z-10 pt-16 overflow-y-auto">
        <MonsterDisplay />

        {q && (
          <div className="w-full px-4 text-center">
            {/* Question text */}
            <div className="font-black text-[2.2rem] my-1 tracking-wide min-h-[40px]" dangerouslySetInnerHTML={{ __html: q.text }} />

            {/* Visual area */}
            {q.shape && <ShapeCanvas shape={q.shape} />}
            {q.pv && <PlaceValueDisplay pv={q.pv} />}
            {q.frac && <FractionBar num={q.frac.num} den={q.frac.den} />}
            {q.fracCompare && <FractionCompare a={q.fracCompare.a} b={q.fracCompare.b} den={q.fracCompare.den} />}

            {/* Answer input for number type */}
            {q.type === 'number' && (
              <div className={`flex items-center justify-center gap-1 border-3 rounded-[14px] px-5 mx-auto mb-1.5 min-w-[130px] max-w-[200px] min-h-[50px] text-[2.2rem] font-black transition-all ${
                state.answerFlash === 'correct' ? 'border-green-400 bg-green-400/15 shadow-[0_0_20px_rgba(74,222,128,0.3)]'
                : state.answerFlash === 'wrong' ? 'border-red-500 bg-red-500/15 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-shake'
                : 'border-purple-400/40 bg-white/[0.08]'
              }`}>
                {state.answerFlash === 'wrong' && b.results.length > 0 ? (
                  <span>
                    {b.results[b.results.length - 1]?.timedOut
                      ? <span className="text-[0.9rem] text-amber-400">Time&apos;s up! {q.answer}</span>
                      : <>{b.results[b.results.length - 1]?.given} <span className="text-[0.7em] text-red-500">{'\u2192'} {q.answer}</span></>
                    }
                  </span>
                ) : b.answer ? (
                  <span>{b.answer}</span>
                ) : (
                  <span className="w-[3px] h-7 bg-white rounded-sm animate-pulse" />
                )}
              </div>
            )}

            {/* Timer bar */}
            <div className="w-[88%] max-w-[340px] h-[7px] bg-white/[0.08] rounded mx-auto mt-1 mb-1.5 overflow-hidden">
              <div className={`h-full rounded bg-gradient-to-r ${timerColor} transition-all duration-100`} style={{ width: `${timerPct}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      {q?.type === 'number' && <Numpad />}
      {(q?.type === 'compare' || q?.type === 'choice') && q.choices && (
        <div className="px-5 pb-4 pt-2 max-w-[400px] mx-auto w-full">
          <div className={`grid gap-2.5 ${q.choices.length <= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {q.choices.map(c => {
              const lastResult = b.results.length > 0 ? b.results[b.results.length - 1] : null;
              const isCorrectChoice = b.inputLocked && c === String(q.answer);
              const isWrongChoice = b.inputLocked && lastResult?.given === c && !lastResult?.isCorrect;
              return (
                <button
                  key={c}
                  onClick={() => choiceAnswer(c)}
                  className={`py-3.5 px-2.5 border-2 rounded-xl text-white font-black text-[1.3rem] transition-all active:scale-95 ${
                    isCorrectChoice ? 'border-green-400 bg-green-400/20 text-green-400'
                    : isWrongChoice ? 'border-red-500 bg-red-500/20 text-red-500'
                    : 'border-white/20 bg-white/[0.06]'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
