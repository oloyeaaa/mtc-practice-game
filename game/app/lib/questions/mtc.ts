import { Question } from '../types';

export function genMTCQuestions(): Question[] {
  const weights: Record<number, [number, number]> = {
    2: [0, 2], 3: [1, 3], 4: [1, 3], 5: [1, 3], 6: [2, 4],
    7: [2, 4], 8: [2, 4], 9: [2, 4], 10: [0, 2], 11: [1, 3], 12: [2, 4],
  };
  const qs: Question[] = [];
  const used = new Set<string>();

  for (const [tStr, lim] of Object.entries(weights)) {
    const table = +tStr;
    const count = lim[0] + Math.floor(Math.random() * (lim[1] - lim[0] + 1));
    let added = 0;
    let tries = 0;
    while (added < count && tries < 50) {
      tries++;
      const b = Math.floor(Math.random() * 12) + 1;
      const key = [Math.min(table, b), Math.max(table, b)].join(',');
      if (!used.has(key)) {
        used.add(key);
        const flip = Math.random() < 0.5;
        qs.push({
          type: 'number',
          text: `${flip ? table : b} <span class="text-purple-400">&times;</span> ${flip ? b : table} <span class="text-purple-400">=</span> ?`,
          answer: table * b,
          explain: `${table} x ${b} = ${table * b}`,
          qLabel: `${table} x ${b}`,
        });
        added++;
      }
    }
  }

  while (qs.length > 25) qs.pop();
  while (qs.length < 25) {
    const t = [6, 7, 8, 9, 12][Math.floor(Math.random() * 5)];
    const b = Math.floor(Math.random() * 12) + 1;
    const key = [Math.min(t, b), Math.max(t, b)].join(',');
    if (!used.has(key)) {
      used.add(key);
      qs.push({
        type: 'number',
        text: `${t} <span class="text-purple-400">&times;</span> ${b} <span class="text-purple-400">=</span> ?`,
        answer: t * b,
        explain: `${t} x ${b} = ${t * b}`,
        qLabel: `${t} x ${b}`,
      });
    }
  }

  // Shuffle
  for (let i = qs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [qs[i], qs[j]] = [qs[j], qs[i]];
  }
  return qs;
}
