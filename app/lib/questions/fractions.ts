import { Question } from '../types';

export function genFractionQ(): Question {
  const r = Math.random();

  if (r < 0.35) {
    const den = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
    const num = Math.floor(Math.random() * (den - 1)) + 1;
    const correct = `${num}/${den}`;
    const choices = [correct];
    while (choices.length < 4) {
      const fn = Math.floor(Math.random() * (den - 1)) + 1;
      const fd = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
      const alt = `${fn}/${fd}`;
      if (!choices.includes(alt)) choices.push(alt);
    }
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return {
      type: 'choice',
      text: 'What fraction is shaded?',
      answer: correct,
      explain: `${num} out of ${den} = ${correct}`,
      qLabel: 'Identify fraction',
      frac: { num, den },
      choices,
    };
  } else if (r < 0.65) {
    const den = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
    const a = Math.floor(Math.random() * (den - 1)) + 1;
    const b = Math.floor(Math.random() * (den - 1)) + 1;
    const ans = a > b ? '>' : a < b ? '<' : '=';
    return {
      type: 'compare',
      text: '',
      answer: ans,
      explain: `${a}/${den} ${ans} ${b}/${den}`,
      qLabel: `${a}/${den} ? ${b}/${den}`,
      choices: ['<', '=', '>'],
      fracCompare: { a, b, den },
    };
  } else if (r < 0.85) {
    const den = [3, 4, 5, 6, 8][Math.floor(Math.random() * 5)];
    const a = Math.floor(Math.random() * (den - 2)) + 1;
    const b = Math.floor(Math.random() * (den - a - 1)) + 1;
    const ansNum = a + b;
    const correct = `${ansNum}/${den}`;
    const choices = [correct];
    while (choices.length < 4) {
      const fn = Math.floor(Math.random() * den) + 1;
      const alt = `${fn}/${den}`;
      if (!choices.includes(alt)) choices.push(alt);
    }
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return {
      type: 'choice',
      text: `<span class="inline-flex flex-col items-center"><span class="border-b-2 border-white px-1">${a}</span><span class="px-1">${den}</span></span> <span class="text-purple-400">+</span> <span class="inline-flex flex-col items-center"><span class="border-b-2 border-white px-1">${b}</span><span class="px-1">${den}</span></span> <span class="text-purple-400">=</span> ?`,
      answer: correct,
      explain: `${a}/${den} + ${b}/${den} = ${ansNum}/${den}`,
      qLabel: `${a}/${den} + ${b}/${den}`,
      choices,
    };
  } else {
    const den = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    const num = Math.floor(Math.random() * (den - 1)) + 1;
    const mult = [2, 3, 4][Math.floor(Math.random() * 3)];
    const eqNum = num * mult;
    const eqDen = den * mult;
    const correct = `${eqNum}/${eqDen}`;
    const choices = [correct];
    while (choices.length < 4) {
      const fn = Math.floor(Math.random() * 10) + 1;
      const fd = Math.floor(Math.random() * 10) + 2;
      const alt = `${fn}/${fd}`;
      if (!choices.includes(alt) && fn / fd !== num / den) choices.push(alt);
    }
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return {
      type: 'choice',
      text: `Which fraction equals <span class="text-purple-400">${num}/${den}</span>?`,
      answer: correct,
      explain: `${num}/${den} = ${eqNum}/${eqDen} (multiply by ${mult})`,
      qLabel: `Equivalent to ${num}/${den}`,
      choices,
    };
  }
}
