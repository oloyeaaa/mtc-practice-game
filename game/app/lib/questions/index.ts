import { Question, WorldType } from '../types';
import { genTimesQ } from './times';
import { genMTCQuestions } from './mtc';
import { genShapeQ } from './shapes';
import { genPlaceValueQ } from './placevalue';
import { genRomanQ } from './roman';
import { genFractionQ } from './fractions';

export { genMTCQuestions };

const generators: Record<string, (level: number) => Question> = {
  times: genTimesQ,
  shapes: () => genShapeQ(),
  placevalue: () => genPlaceValueQ(),
  roman: () => genRomanQ(),
  fractions: () => genFractionQ(),
};

export function getQuestion(world: WorldType, level: number): Question {
  const gen = generators[world] || genTimesQ;
  return gen(level);
}
