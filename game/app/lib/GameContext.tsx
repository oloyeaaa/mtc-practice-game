'use client';

import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { GameState, WorldType, BattleResult, Question, Monster, Pet } from './types';
import { defaultState, saveState, loadState } from './state';
import { randomMonster } from './monsters';
import { getQuestion, genMTCQuestions } from './questions';
import { checkAchievements, getAchievement } from './achievements';
import { EGGS as EGGS_DATA, rollPet as rollPetFn } from './pets';
import * as audio from './audio';

// ═══ Battle state (not persisted) ═══
export interface BattleState {
  active: boolean;
  world: WorldType;
  monster: Monster | null;
  question: Question | null;
  answer: string;
  timerStart: number;
  streak: number;
  bestStreak: number;
  roundCorrect: number;
  roundWrong: number;
  roundCoins: number;
  roundXP: number;
  results: BattleResult[];
  monsterLevel: number;
  mtcQuestions: Question[];
  mtcIndex: number;
  qCount: number;
  maxQ: number;
  inputLocked: boolean;
}

function defaultBattle(): BattleState {
  return {
    active: false,
    world: 'times',
    monster: null,
    question: null,
    answer: '',
    timerStart: 0,
    streak: 0,
    bestStreak: 0,
    roundCorrect: 0,
    roundWrong: 0,
    roundCoins: 0,
    roundXP: 0,
    results: [],
    monsterLevel: 1,
    mtcQuestions: [],
    mtcIndex: 0,
    qCount: 0,
    maxQ: 25,
    inputLocked: false,
  };
}

// ═══ Screens ═══
export type Screen = 'menu' | 'battle' | 'shop' | 'pets' | 'results' | 'achievements';

// ═══ Toast ═══
export interface Toast {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
}

// ═══ Combined state ═══
interface AppState {
  game: GameState;
  battle: BattleState;
  screen: Screen;
  toasts: Toast[];
  monsterHit: boolean;
  monsterDying: boolean;
  answerFlash: '' | 'correct' | 'wrong';
  showLevelUp: boolean;
  levelUpNum: number;
  reward: { name: string; coins: number } | null;
}

// ═══ Actions ═══
type Action =
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'SET_SCREEN'; screen: Screen }
  | { type: 'START_BATTLE'; world: WorldType }
  | { type: 'SET_QUESTION'; question: Question; timerStart: number }
  | { type: 'INPUT_KEY'; key: string }
  | { type: 'INPUT_DEL' }
  | { type: 'SUBMIT_ANSWER'; given: number | string | null; timedOut: boolean; timeTaken: number }
  | { type: 'MONSTER_HIT_END' }
  | { type: 'MONSTER_DYING' }
  | { type: 'SHOW_REWARD'; name: string; coins: number }
  | { type: 'CLOSE_REWARD' }
  | { type: 'SPAWN_MONSTER'; monster: Monster }
  | { type: 'END_ROUND' }
  | { type: 'ANSWER_FLASH_END' }
  | { type: 'LEVEL_UP_END' }
  | { type: 'BUY_EGG'; cost: number }
  | { type: 'ADD_PET'; pet: GameState['pets'][0] }
  | { type: 'EQUIP_PET'; id: string | null }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'UNLOCK_ACHIEVEMENTS'; ids: string[] };

function getPetBonus(state: GameState): number {
  if (!state.equippedPet) return 1;
  const pet = state.pets.find(p => p.id === state.equippedPet);
  return pet?.bonus || 1;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, game: action.state };

    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'START_BATTLE': {
      const world = action.world;
      const battle: BattleState = {
        ...defaultBattle(),
        active: true,
        world,
        maxQ: world === 'mtc' ? 25 : 15,
        monsterLevel: Math.max(1, state.game.level - 1),
        mtcQuestions: world === 'mtc' ? genMTCQuestions() : [],
      };
      const monster = randomMonster(battle.monsterLevel);
      battle.monster = monster;
      return { ...state, battle, screen: 'battle', monsterHit: false, monsterDying: false };
    }

    case 'SET_QUESTION':
      return {
        ...state,
        battle: { ...state.battle, question: action.question, answer: '', inputLocked: false, timerStart: action.timerStart },
        answerFlash: '',
      };

    case 'INPUT_KEY':
      if (state.battle.inputLocked || state.battle.answer.length >= 4) return state;
      return { ...state, battle: { ...state.battle, answer: state.battle.answer + action.key } };

    case 'INPUT_DEL':
      if (state.battle.inputLocked) return state;
      return { ...state, battle: { ...state.battle, answer: state.battle.answer.slice(0, -1) } };

    case 'SUBMIT_ANSWER': {
      const b = state.battle;
      const q = b.question!;
      const isCorrect = !action.timedOut && String(action.given) === String(q.answer);

      const result: BattleResult = {
        qLabel: q.qLabel || '',
        answer: q.answer,
        given: action.given,
        isCorrect,
        timedOut: action.timedOut,
        timeTaken: action.timeTaken,
        explain: q.explain || '',
      };

      const newStreak = isCorrect ? b.streak + 1 : 0;
      const newBestStreak = Math.max(b.bestStreak, newStreak);
      const speedBonus = action.timeTaken < 2 ? 5 : action.timeTaken < 4 ? 2 : 0;
      const streakBonus = Math.min(newStreak, 10);
      const coinBase = isCorrect ? 5 + speedBonus + streakBonus : 0;
      const coinTotal = Math.round(coinBase * getPetBonus(state.game));
      const xpEarned = isCorrect ? 10 + speedBonus : 0;

      // Update monster HP
      const monster = b.monster ? { ...b.monster } : null;
      if (isCorrect && monster) monster.hp = Math.max(0, monster.hp - 1);

      // Update game stats
      const game = { ...state.game };
      game.coins += coinTotal;
      game.xp += xpEarned;
      game.stats = { ...game.stats };
      game.stats.totalCoinsEarned += coinTotal;
      game.stats.totalXPEarned += xpEarned;
      if (isCorrect) {
        game.stats.totalCorrect++;
        if (action.timeTaken < game.stats.fastestAnswer) {
          game.stats.fastestAnswer = action.timeTaken;
        }
      } else {
        game.stats.totalWrong++;
      }
      if (newBestStreak > game.stats.bestStreak) {
        game.stats.bestStreak = newBestStreak;
      }

      // Level up check
      let showLevelUp = false;
      let levelUpNum = game.level;
      while (game.xp >= game.xpToNext) {
        game.xp -= game.xpToNext;
        game.level++;
        game.xpToNext = Math.floor(game.xpToNext * 1.3);
        game.gems += 5;
        showLevelUp = true;
        levelUpNum = game.level;
      }

      return {
        ...state,
        game,
        battle: {
          ...b,
          monster,
          streak: newStreak,
          bestStreak: newBestStreak,
          roundCorrect: b.roundCorrect + (isCorrect ? 1 : 0),
          roundWrong: b.roundWrong + (isCorrect ? 0 : 1),
          roundCoins: b.roundCoins + coinTotal,
          roundXP: b.roundXP + xpEarned,
          results: [...b.results, result],
          qCount: b.qCount + 1,
          mtcIndex: b.world === 'mtc' ? b.mtcIndex + 1 : b.mtcIndex,
          inputLocked: true,
        },
        answerFlash: isCorrect ? 'correct' : 'wrong',
        monsterHit: isCorrect,
        showLevelUp: showLevelUp || state.showLevelUp,
        levelUpNum,
      };
    }

    case 'MONSTER_HIT_END':
      return { ...state, monsterHit: false };

    case 'MONSTER_DYING': {
      const game = { ...state.game };
      game.monstersDefeated++;
      const isBoss = state.battle.monster?.isBoss || false;
      const bonus = isBoss ? 50 : 15;
      const coinTotal = Math.round(bonus * getPetBonus(game));
      game.coins += coinTotal;
      game.xp += isBoss ? 40 : 15;
      game.stats = { ...game.stats };
      game.stats.totalCoinsEarned += coinTotal;
      game.stats.totalXPEarned += isBoss ? 40 : 15;
      while (game.xp >= game.xpToNext) {
        game.xp -= game.xpToNext;
        game.level++;
        game.xpToNext = Math.floor(game.xpToNext * 1.3);
        game.gems += 5;
      }
      return { ...state, game, monsterDying: true };
    }

    case 'SHOW_REWARD':
      return { ...state, reward: { name: action.name, coins: action.coins }, monsterDying: false };

    case 'CLOSE_REWARD':
      return { ...state, reward: null };

    case 'SPAWN_MONSTER': {
      const newLevel = state.battle.monsterLevel + 1;
      return {
        ...state,
        battle: { ...state.battle, monster: action.monster, monsterLevel: newLevel },
        monsterDying: false,
      };
    }

    case 'END_ROUND': {
      const game = { ...state.game };
      game.stats = { ...game.stats };
      game.stats.totalGames++;
      const world = state.battle.world;
      game.stats.worldsPlayed = { ...game.stats.worldsPlayed };
      game.stats.worldsPlayed[world] = (game.stats.worldsPlayed[world] || 0) + 1;
      if (state.battle.roundWrong === 0 && state.battle.roundCorrect > 0) {
        game.stats.perfectRounds++;
      }
      if (world === 'mtc') {
        game.stats.mtcGamesPlayed++;
        if (state.battle.roundCorrect > game.stats.mtcBestScore) {
          game.stats.mtcBestScore = state.battle.roundCorrect;
        }
      }
      return { ...state, game, screen: 'results', battle: { ...state.battle, active: false } };
    }

    case 'ANSWER_FLASH_END':
      return { ...state, answerFlash: '' };

    case 'LEVEL_UP_END':
      return { ...state, showLevelUp: false };

    case 'BUY_EGG':
      return { ...state, game: { ...state.game, coins: state.game.coins - action.cost } };

    case 'ADD_PET':
      return { ...state, game: { ...state.game, pets: [...state.game.pets, action.pet] } };

    case 'EQUIP_PET':
      return { ...state, game: { ...state.game, equippedPet: action.id } };

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] };

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };

    case 'UNLOCK_ACHIEVEMENTS': {
      const achievements = { ...state.game.achievements };
      for (const id of action.ids) achievements[id] = true;
      return { ...state, game: { ...state.game, achievements } };
    }

    default:
      return state;
  }
}

// ═══ Context ═══
interface GameContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  startBattle: (world: WorldType) => void;
  nextQuestion: () => void;
  submitAnswer: (given: number | string | null, timedOut: boolean) => void;
  inputKey: (key: string) => void;
  inputDel: () => void;
  inputGo: () => void;
  choiceAnswer: (val: string) => void;
  goMenu: () => void;
  closeReward: () => void;
  buyEgg: (idx: number) => Pet | null;
  equipPet: (id: string | null) => void;
  checkAndNotifyAchievements: () => void;
  timerRef: React.RefObject<ReturnType<typeof setInterval> | null>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    game: defaultState(),
    battle: defaultBattle(),
    screen: 'menu' as Screen,
    toasts: [],
    monsterHit: false,
    monsterDying: false,
    answerFlash: '' as const,
    showLevelUp: false,
    levelUpNum: 1,
    reward: null,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Load saved state on mount
  useEffect(() => {
    const saved = loadState();
    dispatch({ type: 'LOAD_STATE', state: saved });
  }, []);

  // Auto-save when game state changes
  useEffect(() => {
    saveState(state.game);
  }, [state.game]);

  const checkAndNotifyAchievements = useCallback(() => {
    const gameCopy = { ...stateRef.current.game, achievements: { ...stateRef.current.game.achievements } };
    const newIds = checkAchievements(gameCopy);
    if (newIds.length > 0) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENTS', ids: newIds });
      for (const id of newIds) {
        const ach = getAchievement(id);
        if (ach) {
          audio.sfxAchievement();
          dispatch({
            type: 'ADD_TOAST',
            toast: {
              id: `ach-${id}-${Date.now()}`,
              icon: ach.icon,
              title: ach.name,
              subtitle: ach.description,
              color: ach.category === 'battle' ? '#ef4444'
                : ach.category === 'mastery' ? '#a855f7'
                : ach.category === 'collection' ? '#22c55e'
                : '#fbbf24',
            },
          });
        }
      }
    }
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startBattle = useCallback((world: WorldType) => {
    audio.ensureAudio();
    clearTimer();
    dispatch({ type: 'START_BATTLE', world });
  }, [clearTimer]);

  const nextQuestion = useCallback(() => {
    const s = stateRef.current;
    const b = s.battle;
    if (b.world === 'mtc' && b.mtcIndex >= b.mtcQuestions.length) {
      clearTimer();
      dispatch({ type: 'END_ROUND' });
      checkAndNotifyAchievements();
      return;
    }
    if (b.world !== 'mtc' && b.qCount >= b.maxQ) {
      clearTimer();
      dispatch({ type: 'END_ROUND' });
      checkAndNotifyAchievements();
      return;
    }

    const q = b.world === 'mtc' ? b.mtcQuestions[b.mtcIndex] : getQuestion(b.world, b.monsterLevel);
    dispatch({ type: 'SET_QUESTION', question: q, timerStart: Date.now() });
  }, [clearTimer, checkAndNotifyAchievements]);

  const submitAnswer = useCallback((given: number | string | null, timedOut: boolean) => {
    const s = stateRef.current;
    clearTimer();
    const timeTaken = Math.min(6, (Date.now() - s.battle.timerStart) / 1000);
    const q = s.battle.question!;
    const isCorrect = !timedOut && String(given) === String(q.answer);

    if (isCorrect) {
      audio.sfxCorrect();
      audio.sfxHit();
    } else {
      audio.sfxWrong();
    }

    dispatch({ type: 'SUBMIT_ANSWER', given, timedOut, timeTaken });

    // After submit, check if monster dies or next question
    setTimeout(() => {
      const cur = stateRef.current;
      if (isCorrect && cur.battle.monster && cur.battle.monster.hp <= 0) {
        dispatch({ type: 'MONSTER_DYING' });
        audio.sfxDefeat();
        setTimeout(() => {
          const c2 = stateRef.current;
          const bonus = Math.round((c2.battle.monster?.isBoss ? 50 : 15) * getPetBonus(c2.game));
          dispatch({ type: 'SHOW_REWARD', name: c2.battle.monster?.name || 'Monster', coins: bonus });
          checkAndNotifyAchievements();
        }, 800);
      } else {
        // Check if round is over
        const b2 = cur.battle;
        const roundOver = (b2.world === 'mtc' && b2.mtcIndex >= b2.mtcQuestions.length)
          || (b2.world !== 'mtc' && b2.qCount >= b2.maxQ);
        if (roundOver) {
          setTimeout(() => {
            clearTimer();
            dispatch({ type: 'END_ROUND' });
            checkAndNotifyAchievements();
          }, 800);
        } else {
          setTimeout(() => nextQuestion(), 1200);
        }
      }
    }, 600);
  }, [clearTimer, nextQuestion, checkAndNotifyAchievements]);

  const inputKey = useCallback((key: string) => {
    audio.sfxPress();
    dispatch({ type: 'INPUT_KEY', key });
  }, []);

  const inputDel = useCallback(() => {
    audio.sfxPress();
    dispatch({ type: 'INPUT_DEL' });
  }, []);

  const inputGo = useCallback(() => {
    const s = stateRef.current;
    if (s.battle.inputLocked || s.battle.answer.length === 0) return;
    clearTimer();
    submitAnswer(parseInt(s.battle.answer), false);
  }, [clearTimer, submitAnswer]);

  const choiceAnswer = useCallback((val: string) => {
    if (stateRef.current.battle.inputLocked) return;
    clearTimer();
    submitAnswer(val, false);
  }, [clearTimer, submitAnswer]);

  const goMenu = useCallback(() => {
    clearTimer();
    dispatch({ type: 'SET_SCREEN', screen: 'menu' });
  }, [clearTimer]);

  const closeReward = useCallback(() => {
    dispatch({ type: 'CLOSE_REWARD' });
    const s = stateRef.current;
    const b = s.battle;
    const roundOver = (b.world === 'mtc' && b.mtcIndex >= b.mtcQuestions.length)
      || (b.world !== 'mtc' && b.qCount >= b.maxQ);
    if (roundOver) {
      dispatch({ type: 'END_ROUND' });
      checkAndNotifyAchievements();
    } else {
      const newLevel = b.monsterLevel + 1;
      const monster = randomMonster(newLevel);
      dispatch({ type: 'SPAWN_MONSTER', monster });
      setTimeout(() => nextQuestion(), 300);
    }
  }, [nextQuestion, checkAndNotifyAchievements]);

  const buyEgg = useCallback((idx: number): Pet | null => {
    const egg = EGGS_DATA[idx];
    if (stateRef.current.game.coins < egg.price) return null;
    dispatch({ type: 'BUY_EGG', cost: egg.price });
    const pet = rollPetFn(egg);
    dispatch({ type: 'ADD_PET', pet });
    audio.sfxHatch();
    checkAndNotifyAchievements();
    return pet;
  }, [checkAndNotifyAchievements]);

  const equipPet = useCallback((id: string | null) => {
    const current = stateRef.current.game.equippedPet;
    dispatch({ type: 'EQUIP_PET', id: current === id ? null : id });
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      startBattle,
      nextQuestion,
      submitAnswer,
      inputKey,
      inputDel,
      inputGo,
      choiceAnswer,
      goMenu,
      closeReward,
      buyEgg,
      equipPet,
      checkAndNotifyAchievements,
      timerRef,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
