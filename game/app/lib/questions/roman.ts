import { Question } from '../types';

const ROM_MAP: [number, string][] = [
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

export function toRoman(n: number): string {
  let s = '';
  for (const [v, r] of ROM_MAP) {
    while (n >= v) { s += r; n -= v; }
  }
  return s;
}

export function genRomanQ(): Question {
  const r = Math.random();

  if (r < 0.5) {
    const num = Math.floor(Math.random() * 99) + 1;
    const rom = toRoman(num);
    return {
      type: 'number',
      text: `<span style="font-size:2.5rem">${rom}</span><br>What number is this?`,
      answer: num,
      explain: `${rom} = ${num}`,
      qLabel: `${rom} = ?`,
    };
  } else {
    const num = Math.floor(Math.random() * 99) + 1;
    const correct = toRoman(num);
    const choices = [correct];
    while (choices.length < 4) {
      const off = Math.floor(Math.random() * 20) - 10;
      const alt = num + off;
      if (alt > 0 && alt <= 100 && alt !== num) {
        const r2 = toRoman(alt);
        if (!choices.includes(r2)) choices.push(r2);
      }
    }
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return {
      type: 'choice',
      text: `Which is <span class="text-purple-400">${num}</span> in Roman numerals?`,
      answer: correct,
      explain: `${num} = ${correct}`,
      qLabel: `${num} in Roman`,
      choices,
    };
  }
}
