import { Question } from '../types';

export function genTimesQ(level: number): Question {
  const tables = level < 3 ? [2, 3, 4, 5, 10]
    : level < 6 ? [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    : [6, 7, 8, 9, 11, 12, 6, 7, 8, 9, 12];
  const a = tables[Math.floor(Math.random() * tables.length)];
  const b = Math.floor(Math.random() * 12) + 1;
  return {
    type: 'number',
    text: `${a} <span class="text-purple-400">&times;</span> ${b} <span class="text-purple-400">=</span> ?`,
    answer: a * b,
    explain: `${a} x ${b} = ${a * b}`,
    qLabel: `${a} x ${b}`,
  };
}
