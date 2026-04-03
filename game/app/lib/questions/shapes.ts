import { Question } from '../types';

export function genShapeQ(): Question {
  const r = Math.random();

  if (r < 0.45) {
    const w = Math.floor(Math.random() * 9) + 2;
    const h = Math.floor(Math.random() * 7) + 2;
    const askPeri = Math.random() < 0.5;
    return {
      type: 'number',
      text: askPeri
        ? 'What is the <span class="text-purple-400">perimeter</span>? (cm)'
        : 'What is the <span class="text-purple-400">area</span>? (cm\u00B2)',
      answer: askPeri ? 2 * (w + h) : w * h,
      explain: askPeri
        ? `P = 2 x (${w} + ${h}) = ${2 * (w + h)} cm`
        : `A = ${w} x ${h} = ${w * h} cm\u00B2`,
      qLabel: askPeri ? `Perimeter of ${w}x${h}` : `Area of ${w}x${h}`,
      shape: { type: 'rect', w, h },
    };
  } else if (r < 0.8) {
    const ow = Math.floor(Math.random() * 5) + 5;
    const oh = Math.floor(Math.random() * 4) + 4;
    const cw = Math.floor(Math.random() * (ow - 2)) + 1;
    const ch = Math.floor(Math.random() * (oh - 2)) + 1;
    const area = ow * oh - cw * ch;
    return {
      type: 'number',
      text: 'What is the <span class="text-purple-400">area</span>? (cm\u00B2)',
      answer: area,
      explain: `Full rectangle: ${ow} x ${oh} = ${ow * oh}. Cut: ${cw} x ${ch} = ${cw * ch}. Area = ${ow * oh} - ${cw * ch} = ${area} cm\u00B2`,
      qLabel: 'L-shape area',
      shape: { type: 'lshape', ow, oh, cw, ch },
    };
  } else {
    const w1 = Math.floor(Math.random() * 4) + 2;
    const h1 = Math.floor(Math.random() * 5) + 3;
    const w2 = Math.floor(Math.random() * 4) + 2;
    const h2 = Math.floor(Math.random() * 3) + 2;
    const area = w1 * h1 + w2 * h2;
    return {
      type: 'number',
      text: 'What is the total <span class="text-purple-400">area</span>? (cm\u00B2)',
      answer: area,
      explain: `Shape 1: ${w1}x${h1}=${w1 * h1}. Shape 2: ${w2}x${h2}=${w2 * h2}. Total = ${area} cm\u00B2`,
      qLabel: 'Compound area',
      shape: { type: 'compound', w1, h1, w2, h2 },
    };
  }
}
