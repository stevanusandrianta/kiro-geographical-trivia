import { GameState, GameStatus, GameSession } from '../types/game';
import { Country, getRandomCountry } from '../data/countries';
import { QuestionManager } from './QuestionManager';
import { ScoreManager } from './ScoreManager';
import { AnswerValidator } from './AnswerValidator';
import { GameProgressTracker } from './GameProgressTracker';

export class GameManager {
  private gameState: GameState;
  private questionManager: QuestionManager;
  private scoreManager: ScoreManager;
  private answerValidator: AnswerValidator;
  private progressTracker: GameProgressTracker;
  private usedCountries: Set<string> = new Set();

  constructor() {
    this.questionManager = new QuestionManager();
    this.scoreManager = new ScoreManager();
    this.answerValidator = new AnswerValidator();
    this.progressTracker = new GameProgressTracker(this.scoreManager);
    
    this.gameState = {
      currentCountry: null,
      currentScore: 0,
      hintsUsed: 0,
      gameStatus: GameStatus.WAITING,
      totalQuestions: 0
    };
  }

  /**
   * Starts a new game session
   */
  public startGame(): void {
    this.resetGame();
    this.gameState.gameStatus = GameStatus.PLAYING;
    this.nextQuestion();
  }

  /**
   * Loads the next question
   */
  public nextQuestion(): void {
    if (this.gameState.gameStatus !== GameStatus.PLAYING) {
      throw new Error('Cannot load next question when game is not in playing state');
    }

    const country = this.selectNextCountry();
    this.gameState.currentCountry = country;
    this.gameState.totalQuestions++;
    this.gameState.hintsUsed = 0;
    
    this.questionManager.createQuestion(country);
  }

  /**
   * Submits an answer for the current question
   */
  public submitAnswer(userInput: string): {
    isCorrect: boolean;
    isClose: boolean;
    message: string;
    suggestion?: string;
    pointsAwarded: number;
  } {
    if (this.gameState.gameStatus !== GameStatus.PLAYING) {
      throw new Error('Cannot submit answer when game is not in playing state');
    }

    if (!this.gameState.currentCountry) {
      throw new Error('No current question to answer');
    }

    if (!this.answerValidator.isValidInput(userInput)) {
      return {
        isCorrect: false,
        isClose: false,
        message: 'Please enter a valid answer.',
        pointsAwarded: 0
      };
    }

    const validationResult = this.answerValidator.validateAnswer(
      userInput,
      this.gameState.currentCountry.capital
    );

    this.questionManager.addAttempt(userInput);

    if (validationResult.isCorrect) {
      const pointsAwarded = this.questionManager.completeQuestion(true);
      this.scoreManager.addScore(
        this.gameState.currentCountry.name,
        this.gameState.hintsUsed,
        true
      );
      this.gameState.currentScore = this.scoreManager.getCurrentScore();
      
      return {
        isCorrect: true,
        isClose: false,
        message: validationResult.message,
        pointsAwarded
      };
    }

    return {
      isCorrect: false,
      isClose: validationResult.isClose,
      message: validationResult.message,
      suggestion: validationResult.suggestion,
      pointsAwarded: 0
    };
  }

  /**
   * Requests a hint for the current question
   */
  public requestHint(): string | null {
    if (this.gameState.gameStatus !== GameStatus.PLAYING) {
      throw new Error('Cannot request hint when game is not in playing state');
    }

    const hint = this.questionManager.requestHint();
    if (hint) {
      this.gameState.hintsUsed = this.questionManager.getHintsUsed();
    }
    
    return hint;
  }

  /**
   * Skips the current question (marks as incorrect)
   */
  public skipQuestion(): void {
    if (this.gameState.gameStatus !== GameStatus.PLAYING) {
      throw new Error('Cannot skip question when game is not in playing state');
    }

    if (!this.gameState.currentCountry) {
      throw new Error('No current question to skip');
    }

    this.questionManager.completeQuestion(false);
    this.scoreManager.addScore(
      this.gameState.currentCountry.name,
      this.gameState.hintsUsed,
      false
    );
    this.gameState.currentScore = this.scoreManager.getCurrentScore();
  }

  /**
   * Ends the current game session
   */
  public endGame(): GameSession {
    if (this.gameState.gameStatus === GameStatus.ENDED) {
      throw new Error('Game is already ended');
    }

    this.gameState.gameStatus = GameStatus.ENDED;
    
    const session: GameSession = {
      sessionId: this.generateSessionId(),
      startTime: new Date(), // In a real app, this would be tracked from start
      questions: this.scoreManager.getScoreHistory().map(entry => ({
        country: { name: entry.countryName } as Country, // Simplified for session
        hintsAvailable: [],
        hintsRevealed: [],
        attempts: [],
        isCompleted: true,
        pointsAwarded: entry.pointsAwarded
      })),
      finalScore: this.scoreManager.getCurrentScore(),
      totalPossibleScore: this.scoreManager.getMaxPossibleScore(),
      completedAt: new Date()
    };

    return session;
  }

  /**
   * Gets the current game state
   */
  public getGameState(): GameState {
    return { ...this.gameState };
  }

  /**
   * Gets the current question details
   */
  public getCurrentQuestion(): {
    country: Country | null;
    hintsRevealed: string[];
    hintsRemaining: number;
    attempts: string[];
  } {
    const question = this.questionManager.getCurrentQuestion();
    
    return {
      country: this.gameState.currentCountry,
      hintsRevealed: question?.hintsRevealed || [],
      hintsRemaining: this.questionManager.getHintsRemaining(),
      attempts: question?.attempts || []
    };
  }

  /**
   * Gets current progress information
   */
  public getProgress() {
    return this.progressTracker.getProgressDisplay();
  }

  /**
   * Gets detailed progress information
   */
  public getDetailedProgress() {
    return this.progressTracker.getDetailedProgress();
  }

  /**
   * Gets achievement notifications for the last question
   */
  public getAchievementNotifications(): string[] {
    return this.progressTracker.getAchievementNotifications();
  }

  /**
   * Gets a formatted progress summary
   */
  public getProgressSummary(): string {
    return this.progressTracker.getProgressSummary();
  }

  /**
   * Checks if the game is in a playable state
   */
  public isPlaying(): boolean {
    return this.gameState.gameStatus === GameStatus.PLAYING;
  }

  /**
   * Checks if the game has ended
   */
  public hasEnded(): boolean {
    return this.gameState.gameStatus === GameStatus.ENDED;
  }

  /**
   * Checks if there are more hints available
   */
  public hasMoreHints(): boolean {
    return this.questionManager.hasMoreHints();
  }

  /**
   * Resets the game to initial state
   */
  private resetGame(): void {
    this.gameState = {
      currentCountry: null,
      currentScore: 0,
      hintsUsed: 0,
      gameStatus: GameStatus.WAITING,
      totalQuestions: 0
    };
    
    this.questionManager.reset();
    this.scoreManager.reset();
    this.usedCountries.clear();
  }

  /**
   * Selects the next country, avoiding recent repeats
   */
  private selectNextCountry(): Country {
    let country: Country;
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loop
    
    do {
      country = getRandomCountry();
      attempts++;
      
      // If we've used most countries, reset the used set
      if (this.usedCountries.size > 15 || attempts > maxAttempts) {
        this.usedCountries.clear();
        break;
      }
    } while (this.usedCountries.has(country.name));
    
    this.usedCountries.add(country.name);
    return country;
  }

  /**
   * Generates a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}