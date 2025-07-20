import { Country } from '../data/countries';

// Game status enumeration
export enum GameStatus {
  WAITING = 'waiting',
  PLAYING = 'playing',
  ENDED = 'ended'
}

// Quiz categories
export enum QuizCategory {
  COUNTRY_TO_CAPITAL = 'country_to_capital',
  CAPITAL_TO_COUNTRY = 'capital_to_country',
  FLAG_TO_COUNTRY = 'flag_to_country',
  RANDOM = 'random'
}

// Scoring constants
export const SCORING = {
  MAX_TIME_BONUS: 5,
  BASE_SCORE: 2,
  HINT_PENALTY: 1,
  TIME_LIMIT: 10, // seconds
  MAX_HINTS: 3
} as const;

// Core game state interface
export interface GameState {
  currentCountry: Country | null;
  currentScore: number;
  hintsUsed: number;
  gameStatus: GameStatus;
  totalQuestions: number;
  quizCategory: QuizCategory;
  timeRemaining: number;
  questionStartTime: number;
}

// Individual game question interface
export interface GameQuestion {
  country: Country;
  category: QuizCategory;
  questionText: string;
  correctAnswer: string;
  hintsAvailable: string[];
  hintsRevealed: string[];
  attempts: string[];
  isCompleted: boolean;
  pointsAwarded: number;
  timeUsed: number;
  startTime: number;
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