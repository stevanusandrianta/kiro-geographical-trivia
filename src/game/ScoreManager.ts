import { SCORING } from '../types/game';

export interface ScoreEntry {
  questionNumber: number;
  countryName: string;
  hintsUsed: number;
  pointsAwarded: number;
  isCorrect: boolean;
}

export interface ScoreStats {
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  averageHintsUsed: number;
  perfectAnswers: number; // Correct on first try
  scorePercentage: number;
}

export class ScoreManager {
  private currentScore: number = 0;
  private scoreHistory: ScoreEntry[] = [];
  private questionCounter: number = 0;

  /**
   * Calculates points based on time used and hints used
   */
  public calculatePoints(timeUsed: number, hintsUsed: number, isCorrect: boolean): number {
    if (!isCorrect) {
      return 0;
    }

    // Base score
    let points = SCORING.BASE_SCORE;
    
    // Time bonus (faster = more points)
    const timeBonus = Math.max(0, SCORING.MAX_TIME_BONUS * (SCORING.TIME_LIMIT - timeUsed) / SCORING.TIME_LIMIT);
    points += Math.round(timeBonus);
    
    // Hint penalty
    points -= (hintsUsed * SCORING.HINT_PENALTY);
    
    // Minimum 1 point for correct answers
    return Math.max(1, points);
  }

  /**
   * Adds points for a completed question
   */
  public addScore(countryName: string, timeUsed: number, hintsUsed: number, isCorrect: boolean): number {
    const points = this.calculatePoints(timeUsed, hintsUsed, isCorrect);
    this.currentScore += points;
    this.questionCounter++;

    const scoreEntry: ScoreEntry = {
      questionNumber: this.questionCounter,
      countryName,
      hintsUsed,
      pointsAwarded: points,
      isCorrect
    };

    this.scoreHistory.push(scoreEntry);
    return points;
  }

  /**
   * Gets the current total score
   */
  public getCurrentScore(): number {
    return this.currentScore;
  }

  /**
   * Gets the total number of questions answered
   */
  public getTotalQuestions(): number {
    return this.questionCounter;
  }

  /**
   * Gets the maximum possible score for questions answered so far
   */
  public getMaxPossibleScore(): number {
    return this.questionCounter * (SCORING.BASE_SCORE + SCORING.MAX_TIME_BONUS);
  }

  /**
   * Gets the score history
   */
  public getScoreHistory(): ScoreEntry[] {
    return [...this.scoreHistory];
  }

  /**
   * Gets the last score entry
   */
  public getLastScoreEntry(): ScoreEntry | null {
    return this.scoreHistory.length > 0 ? this.scoreHistory[this.scoreHistory.length - 1] : null;
  }

  /**
   * Calculates comprehensive score statistics
   */
  public getScoreStats(): ScoreStats {
    if (this.questionCounter === 0) {
      return {
        totalScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        averageHintsUsed: 0,
        perfectAnswers: 0,
        scorePercentage: 0
      };
    }

    const correctAnswers = this.scoreHistory.filter(entry => entry.isCorrect).length;
    const totalHints = this.scoreHistory.reduce((sum, entry) => sum + entry.hintsUsed, 0);
    const perfectAnswers = this.scoreHistory.filter(entry => entry.isCorrect && entry.hintsUsed === 0).length;
    const maxPossible = this.getMaxPossibleScore();
    const scorePercentage = maxPossible > 0 ? (this.currentScore / maxPossible) * 100 : 0;

    return {
      totalScore: this.currentScore,
      totalQuestions: this.questionCounter,
      correctAnswers,
      averageHintsUsed: this.questionCounter > 0 ? totalHints / this.questionCounter : 0,
      perfectAnswers,
      scorePercentage: Math.round(scorePercentage * 100) / 100 // Round to 2 decimal places
    };
  }

  /**
   * Gets scoring breakdown by hint usage
   */
  public getScoringBreakdown(): {
    noHints: number;
    oneHint: number;
    multipleHints: number;
    incorrect: number;
  } {
    const breakdown = {
      noHints: 0,
      oneHint: 0,
      multipleHints: 0,
      incorrect: 0
    };

    this.scoreHistory.forEach(entry => {
      if (!entry.isCorrect) {
        breakdown.incorrect++;
      } else if (entry.hintsUsed === 0) {
        breakdown.noHints++;
      } else if (entry.hintsUsed === 1) {
        breakdown.oneHint++;
      } else {
        breakdown.multipleHints++;
      }
    });

    return breakdown;
  }

  /**
   * Resets the score manager to initial state
   */
  public reset(): void {
    this.currentScore = 0;
    this.scoreHistory = [];
    this.questionCounter = 0;
  }

  /**
   * Gets a formatted score summary string
   */
  public getScoreSummary(): string {
    const stats = this.getScoreStats();
    
    if (stats.totalQuestions === 0) {
      return "No questions answered yet.";
    }

    const lines = [
      `Final Score: ${stats.totalScore}/${this.getMaxPossibleScore()} (${stats.scorePercentage}%)`,
      `Questions Answered: ${stats.totalQuestions}`,
      `Correct Answers: ${stats.correctAnswers}`,
      `Perfect Answers: ${stats.perfectAnswers}`,
      `Average Hints Used: ${Math.round(stats.averageHintsUsed * 100) / 100}`
    ];

    return lines.join('\n');
  }

  /**
   * Checks if the current score is a perfect score
   */
  public isPerfectScore(): boolean {
    return this.currentScore === this.getMaxPossibleScore() && this.questionCounter > 0;
  }

  /**
   * Gets the score efficiency as a percentage
   */
  public getScoreEfficiency(): number {
    const maxPossible = this.getMaxPossibleScore();
    return maxPossible > 0 ? (this.currentScore / maxPossible) * 100 : 0;
  }
}