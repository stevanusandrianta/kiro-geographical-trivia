import { GameState, GameStatus, GameSession, QuizCategory, SCORING } from '../types/game';
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
  private timerInterval: NodeJS.Timeout | null = null;
  
  // Callback for timer updates
  public onTimerUpdate: (timeRemaining: number) => void = () => {};

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
      totalQuestions: 0,
      quizCategory: QuizCategory.COUNTRY_TO_CAPITAL,
      timeRemaining: SCORING.TIME_LIMIT,
      questionStartTime: 0
    };
  }

  /**
   * Starts a new game session
   */
  public startGame(category: QuizCategory = QuizCategory.COUNTRY_TO_CAPITAL): void {
    this.resetGame();
    this.gameState.quizCategory = category;
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
    
    // Determine the actual category for this question
    let actualCategory = this.gameState.quizCategory;
    if (this.gameState.quizCategory === QuizCategory.RANDOM) {
      const categories = [
        QuizCategory.COUNTRY_TO_CAPITAL,
        QuizCategory.CAPITAL_TO_COUNTRY,
        QuizCategory.FLAG_TO_COUNTRY
      ];
      actualCategory = categories[Math.floor(Math.random() * categories.length)];
    }

    this.gameState.currentCountry = country;
    this.gameState.totalQuestions++;
    this.gameState.hintsUsed = 0;
    this.gameState.timeRemaining = SCORING.TIME_LIMIT;
    this.gameState.questionStartTime = Date.now();
    
    this.questionManager.createQuestion(country, actualCategory);
    this.startTimer();
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

    const currentQuestion = this.questionManager.getCurrentQuestion();
    if (!currentQuestion) {
      throw new Error('No current question available');
    }

    const validationResult = this.answerValidator.validateAnswer(
      userInput,
      currentQuestion.correctAnswer
    );

    this.questionManager.addAttempt(userInput);

    if (validationResult.isCorrect) {
      this.stopTimer();
      const timeUsed = SCORING.TIME_LIMIT - this.gameState.timeRemaining;
      const pointsAwarded = this.questionManager.completeQuestion(true);
      
      this.scoreManager.addScore(
        this.gameState.currentCountry.name,
        timeUsed,
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

    this.stopTimer();
    const timeUsed = SCORING.TIME_LIMIT - this.gameState.timeRemaining;
    this.questionManager.completeQuestion(false);
    this.scoreManager.addScore(
      this.gameState.currentCountry.name,
      timeUsed,
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
    questionText?: string;
    correctAnswer?: string;
    category?: QuizCategory;
  } {
    const question = this.questionManager.getCurrentQuestion();
    
    return {
      country: this.gameState.currentCountry,
      hintsRevealed: question?.hintsRevealed || [],
      hintsRemaining: this.questionManager.getHintsRemaining(),
      attempts: question?.attempts || [],
      questionText: question?.questionText,
      correctAnswer: question?.correctAnswer,
      category: question?.category
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
   * Gets the current time remaining
   */
  public getTimeRemaining(): number {
    return this.gameState.timeRemaining;
  }

  /**
   * Starts the timer for the current question
   */
  private startTimer(): void {
    this.stopTimer(); // Clear any existing timer
    
    this.timerInterval = setInterval(() => {
      this.gameState.timeRemaining--;
      // Call the timer update callback to refresh UI
      this.onTimerUpdate(this.gameState.timeRemaining);
      
      if (this.gameState.timeRemaining <= 0) {
        this.handleTimeUp();
      }
    }, 1000);
  }

  /**
   * Stops the current timer
   */
  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Handles when time runs out
   */
  private handleTimeUp(): void {
    this.stopTimer();
    
    if (this.gameState.currentCountry) {
      this.questionManager.completeQuestion(false);
      this.scoreManager.addScore(
        this.gameState.currentCountry.name,
        SCORING.TIME_LIMIT,
        this.gameState.hintsUsed,
        false
      );
      this.gameState.currentScore = this.scoreManager.getCurrentScore();
    }
  }

  /**
   * Resets the game to initial state
   */
  private resetGame(): void {
    this.stopTimer();
    
    this.gameState = {
      currentCountry: null,
      currentScore: 0,
      hintsUsed: 0,
      gameStatus: GameStatus.WAITING,
      totalQuestions: 0,
      quizCategory: QuizCategory.COUNTRY_TO_CAPITAL,
      timeRemaining: SCORING.TIME_LIMIT,
      questionStartTime: 0
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
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}