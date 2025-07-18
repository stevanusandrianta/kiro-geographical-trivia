import { GameManager } from '../GameManager';
import { GameStatus } from '../../types/game';

describe('GameManager Integration', () => {
  let gameManager: GameManager;

  beforeEach(() => {
    gameManager = new GameManager();
  });

  describe('complete game flow', () => {
    it('should handle a complete game session', () => {
      // Start game
      gameManager.startGame();
      expect(gameManager.isPlaying()).toBe(true);
      
      const gameState = gameManager.getGameState();
      expect(gameState.gameStatus).toBe(GameStatus.PLAYING);
      expect(gameState.totalQuestions).toBe(1);
      expect(gameState.currentCountry).not.toBeNull();
      
      // Get current question
      const question = gameManager.getCurrentQuestion();
      expect(question.country).not.toBeNull();
      expect(question.hintsRevealed).toHaveLength(0);
      expect(question.hintsRemaining).toBe(3);
      
      // Request a hint
      const hint = gameManager.requestHint();
      expect(hint).not.toBeNull();
      expect(hint).toContain('letters');
      
      const updatedQuestion = gameManager.getCurrentQuestion();
      expect(updatedQuestion.hintsRevealed).toHaveLength(1);
      expect(updatedQuestion.hintsRemaining).toBe(2);
      
      // Submit correct answer
      const capital = question.country!.capital;
      const result = gameManager.submitAnswer(capital);
      
      expect(result.isCorrect).toBe(true);
      expect(result.pointsAwarded).toBe(2); // 2 points for correct after 1 hint
      
      // Check score updated
      const finalState = gameManager.getGameState();
      expect(finalState.currentScore).toBe(2);
      
      // End game
      const session = gameManager.endGame();
      expect(session.finalScore).toBe(2);
      expect(session.totalPossibleScore).toBe(3);
      expect(gameManager.hasEnded()).toBe(true);
    });

    it('should handle incorrect answers and hints', () => {
      gameManager.startGame();
      const question = gameManager.getCurrentQuestion();
      
      // Submit wrong answer
      const wrongResult = gameManager.submitAnswer('WrongAnswer');
      expect(wrongResult.isCorrect).toBe(false);
      expect(wrongResult.pointsAwarded).toBe(0);
      
      // Request all hints
      gameManager.requestHint(); // Hint 1
      gameManager.requestHint(); // Hint 2
      gameManager.requestHint(); // Hint 3
      
      expect(gameManager.hasMoreHints()).toBe(false);
      
      // Skip question
      gameManager.skipQuestion();
      
      const finalState = gameManager.getGameState();
      expect(finalState.currentScore).toBe(0);
    });

    it('should track progress and achievements', () => {
      gameManager.startGame();
      
      // Answer perfectly
      const question = gameManager.getCurrentQuestion();
      const capital = question.country!.capital;
      gameManager.submitAnswer(capital);
      
      const progress = gameManager.getProgress();
      expect(progress.currentScore).toBe(3);
      expect(progress.questionsAnswered).toBe(1);
      expect(progress.scorePercentage).toBe(100);
      
      const achievements = gameManager.getAchievementNotifications();
      expect(achievements).toContain("🎯 Perfect Answer! No hints needed!");
    });
  });

  describe('error handling', () => {
    it('should throw error when submitting answer before starting game', () => {
      expect(() => gameManager.submitAnswer('Paris')).toThrow('Cannot submit answer when game is not in playing state');
    });

    it('should throw error when requesting hint before starting game', () => {
      expect(() => gameManager.requestHint()).toThrow('Cannot request hint when game is not in playing state');
    });

    it('should handle invalid input gracefully', () => {
      gameManager.startGame();
      const result = gameManager.submitAnswer('');
      
      expect(result.isCorrect).toBe(false);
      expect(result.message).toBe('Please enter a valid answer.');
    });
  });
});