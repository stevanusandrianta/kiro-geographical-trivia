import { GameQuestion, SCORING } from '../types/game';
import { Country } from '../data/countries';
import { HintSystem } from './HintSystem';

export class QuestionManager {
  private hintSystem: HintSystem;
  private currentQuestion: GameQuestion | null = null;

  constructor() {
    this.hintSystem = new HintSystem();
  }

  /**
   * Creates a new question for the given country
   */
  public createQuestion(country: Country): GameQuestion {
    const question: GameQuestion = {
      country,
      hintsAvailable: this.hintSystem.generateHintsUpToLevel(country.capital, this.hintSystem.getMaxHints()),
      hintsRevealed: [],
      attempts: [],
      isCompleted: false,
      pointsAwarded: 0
    };

    this.currentQuestion = question;
    return question;
  }

  /**
   * Requests the next available hint for the current question
   */
  public requestHint(): string | null {
    if (!this.currentQuestion) {
      throw new Error('No active question to provide hint for');
    }

    if (this.currentQuestion.isCompleted) {
      throw new Error('Cannot request hint for completed question');
    }

    const nextHintIndex = this.currentQuestion.hintsRevealed.length;
    
    if (nextHintIndex >= this.currentQuestion.hintsAvailable.length) {
      return null; // No more hints available
    }

    const nextHint = this.currentQuestion.hintsAvailable[nextHintIndex];
    this.currentQuestion.hintsRevealed.push(nextHint);
    
    return nextHint;
  }

  /**
   * Gets the number of hints used for the current question
   */
  public getHintsUsed(): number {
    return this.currentQuestion?.hintsRevealed.length || 0;
  }

  /**
   * Gets the number of hints remaining for the current question
   */
  public getHintsRemaining(): number {
    if (!this.currentQuestion) {
      return 0;
    }
    
    return this.currentQuestion.hintsAvailable.length - this.currentQuestion.hintsRevealed.length;
  }

  /**
   * Checks if more hints are available for the current question
   */
  public hasMoreHints(): boolean {
    return this.getHintsRemaining() > 0;
  }

  /**
   * Gets all revealed hints for the current question
   */
  public getRevealedHints(): string[] {
    return this.currentQuestion?.hintsRevealed || [];
  }

  /**
   * Adds an attempt to the current question
   */
  public addAttempt(attempt: string): void {
    if (!this.currentQuestion) {
      throw new Error('No active question to add attempt to');
    }

    if (this.currentQuestion.isCompleted) {
      throw new Error('Cannot add attempt to completed question');
    }

    this.currentQuestion.attempts.push(attempt);
  }

  /**
   * Completes the current question and calculates points
   */
  public completeQuestion(isCorrect: boolean): number {
    if (!this.currentQuestion) {
      throw new Error('No active question to complete');
    }

    if (this.currentQuestion.isCompleted) {
      throw new Error('Question is already completed');
    }

    this.currentQuestion.isCompleted = true;
    
    if (isCorrect) {
      this.currentQuestion.pointsAwarded = this.calculatePoints(this.currentQuestion.hintsRevealed.length);
    } else {
      this.currentQuestion.pointsAwarded = SCORING.INCORRECT_AFTER_ALL_HINTS;
    }

    return this.currentQuestion.pointsAwarded;
  }

  /**
   * Calculates points based on the number of hints used
   */
  private calculatePoints(hintsUsed: number): number {
    if (hintsUsed === 0) {
      return SCORING.CORRECT_FIRST_TRY;
    } else if (hintsUsed === 1) {
      return SCORING.CORRECT_AFTER_ONE_HINT;
    } else {
      return SCORING.CORRECT_AFTER_MULTIPLE_HINTS;
    }
  }

  /**
   * Gets the current question
   */
  public getCurrentQuestion(): GameQuestion | null {
    return this.currentQuestion;
  }

  /**
   * Resets the question manager state
   */
  public reset(): void {
    this.currentQuestion = null;
  }

  /**
   * Gets question statistics
   */
  public getQuestionStats(): {
    hintsUsed: number;
    hintsRemaining: number;
    attempts: number;
    isCompleted: boolean;
  } {
    if (!this.currentQuestion) {
      return {
        hintsUsed: 0,
        hintsRemaining: 0,
        attempts: 0,
        isCompleted: false
      };
    }

    return {
      hintsUsed: this.currentQuestion.hintsRevealed.length,
      hintsRemaining: this.currentQuestion.hintsAvailable.length - this.currentQuestion.hintsRevealed.length,
      attempts: this.currentQuestion.attempts.length,
      isCompleted: this.currentQuestion.isCompleted
    };
  }
}