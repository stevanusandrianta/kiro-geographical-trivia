import { Country } from '../data/countries';

// Game status enumeration
export enum GameStatus {
  WAITING = 'waiting',
  PLAYING = 'playing',
  ENDED = 'ended'
}

// Scoring constants
export const SCORING = {
  CORRECT_FIRST_TRY: 3,
  CORRECT_AFTER_ONE_HINT: 2,
  CORRECT_AFTER_MULTIPLE_HINTS: 1,
  INCORRECT_AFTER_ALL_HINTS: 0,
  MAX_HINTS: 3
} as const;

// Core game state interface
export interface GameState {
  currentCountry: Country | null;
  currentScore: number;
  hintsUsed: number;
  gameStatus: GameStatus;
  totalQuestions: number;
}

// Individual game question interface
export interface GameQuestion {
  country: Country;
  hintsAvailable: string[];
  hintsRevealed: string[];
  attempts: string[];
  isCompleted: boolean;
  pointsAwarded: number;
}

// Hint level configuration
export interface HintLevel {
  level: number;
  description: string;
  generator: (capital: string) => string;
}

// Game session data
export interface GameSession {
  sessionId: string;
  startTime: Date;
  questions: GameQuestion[];
  finalScore: number;
  totalPossibleScore: number;
  completedAt?: Date;
}

// Answer validation result
export interface ValidationResult {
  isCorrect: boolean;
  isClose: boolean;
  suggestion?: string;
  message: string;
}

// Game configuration options
export interface GameConfig {
  maxHints: number;
  enableFuzzyMatching: boolean;
  continentFilter?: string;
  difficultyLevel?: 'easy' | 'medium' | 'hard';
}