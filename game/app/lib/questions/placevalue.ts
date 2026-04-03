import { Question } from '../types';

export function genPlaceValueQ(): Question {
  const r = Math.random();

  if (r < 0.3) {
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 9);
    const o = Math.floor(Math.random() * 9);
    const num = h * 100 + t * 10 + o;
    return {
      type: 'number',
      text: 'What number is shown?',
      answer: num,
      explain: `${h} hundreds + ${t} tens + ${o} ones = ${num}`,
      qLabel: 'Place value counters',
      pv: { h, t, o },
    };
  } else if (r < 0.55) {
    const a = Math.floor(Math.random() * 900) + 100;
    const b = Math.floor(Math.random() * 900) + 100;
    const ans = a > b ? '>' : a < b ? '<' : '=';
    return {
      type: 'compare',
      text: `${a} __ ${b}`,
      answer: ans,
      explain: `${a} ${ans} ${b}`,
      qLabel: `${a} ? ${b}`,
      choices: ['<', '=', '>'],
    };
  } else if (r < 0.8) {
    const num = Math.floor(Math.random() * 800) + 100;
    const ops = [
      { label: '10 more', fn: (n: number) => n + 10 },
      { label: '10 less', fn: (n: number) => n - 10 },
      { label: '100 more', fn: (n: number) => n + 100 },
      { label: '100 less', fn: (n: number) => n - 100 },
    ];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const ans = op.fn(num);
    return {
      type: 'number',
      text: `What is <span class="text-purple-400">${op.label}</span> than ${num}?`,
      answer: ans,
      explain: `${num} \u2192 ${op.label} \u2192 ${ans}`,
      qLabel: `${op.label} than ${num}`,
    };
  } else {
    const num = Math.floor(Math.random() * 900) + 50;
    const roundTo = Math.random() < 0.5 ? 10 : 100;
    const ans = Math.round(num / roundTo) * roundTo;
    return {
      type: 'number',
      text: `Round ${num} to the nearest <span class="text-purple-400">${roundTo}</span>`,
      answer: ans,
      explain: `${num} rounded to nearest ${roundTo} = ${ans}`,
      qLabel: `Round ${num}`,
    };
  }
}
