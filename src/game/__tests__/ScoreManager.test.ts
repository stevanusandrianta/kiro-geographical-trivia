import { ScoreManager } from '../ScoreManager';
import { SCORING } from '../../types/game';

describe('ScoreManager', () => {
  let scoreManager: ScoreManager;

  beforeEach(() => {
    scoreManager = new ScoreManager();
  });

  describe('calculatePoints', () => {
    it('should return 3 points for correct answer without hints', () => {
      const points = scoreManager.calculatePoints(0, true);
      expect(points).toBe(SCORING.CORRECT_FIRST_TRY);
    });

    it('should return 2 points for correct answer after 1 hint', () => {
      const points = scoreManager.calculatePoints(1, true);
      expect(points).toBe(SCORING.CORRECT_AFTER_ONE_HINT);
    });

    it('should return 1 point for correct answer after multiple hints', () => {
      const points = scoreManager.calculatePoints(2, true);
      expect(points).toBe(SCORING.CORRECT_AFTER_MULTIPLE_HINTS);
    });

    it('should return 1 point for correct answer after 3 hints', () => {
      const points = scoreManager.calculatePoints(3, true);
      expect(points).toBe(SCORING.CORRECT_AFTER_MULTIPLE_HINTS);
    });

    it('should return 0 points for incorrect answer', () => {
      const points = scoreManager.calculatePoints(0, false);
      expect(points).toBe(SCORING.INCORRECT_AFTER_ALL_HINTS);
    });

    it('should return 0 points for incorrect answer regardless of hints used', () => {
      expect(scoreManager.calculatePoints(1, false)).toBe(SCORING.INCORRECT_AFTER_ALL_HINTS);
      expect(scoreManager.calculatePoints(2, false)).toBe(SCORING.INCORRECT_AFTER_ALL_HINTS);
      expect(scoreManager.calculatePoints(3, false)).toBe(SCORING.INCORRECT_AFTER_ALL_HINTS);
    });
  });

  describe('addScore', () => {
    it('should add score and update totals', () => {
      const points = scoreManager.addScore('France', 0, true);
      
      expect(points).toBe(3);
      expect(scoreManager.getCurrentScore()).toBe(3);
      expect(scoreManager.getTotalQuestions()).toBe(1);
    });

    it('should accumulate scores across multiple questions', () => {
      scoreManager.addScore('France', 0, true); // 3 points
      scoreManager.addScore('Germany', 1, true); // 2 points
      scoreManager.addScore('Italy', 2, false); // 0 points
      
      expect(scoreManager.getCurrentScore()).toBe(5);
      expect(scoreManager.getTotalQuestions()).toBe(3);
    });

    it('should create score history entries', () => {
      scoreManager.addScore('France', 1, true);
      scoreManager.addScore('Germany', 0, false);
      
      const history = scoreManager.getScoreHistory();
      expect(history).toHaveLength(2);
      
      expect(history[0]).toEqual({
        questionNumber: 1,
        countryName: 'France',
        hintsUsed: 1,
        pointsAwarded: 2,
        isCorrect: true
      });
      
      expect(history[1]).toEqual({
        questionNumber: 2,
        countryName: 'Germany',
        hintsUsed: 0,
        pointsAwarded: 0,
        isCorrect: false
      });
    });
  });

  describe('score tracking methods', () => {
    beforeEach(() => {
      scoreManager.addScore('France', 0, true); // 3 points
      scoreManager.addScore('Germany', 1, true); // 2 points
      scoreManager.addScore('Italy', 2, false); // 0 points
    });

    it('should return current score', () => {
      expect(scoreManager.getCurrentScore()).toBe(5);
    });

    it('should return total questions', () => {
      expect(scoreManager.getTotalQuestions()).toBe(3);
    });

    it('should calculate max possible score', () => {
      expect(scoreManager.getMaxPossibleScore()).toBe(9); // 3 questions * 3 points each
    });

    it('should return score history copy', () => {
      const history1 = scoreManager.getScoreHistory();
      const history2 = scoreManager.getScoreHistory();
      
      expect(history1).not.toBe(history2); // Different references
      expect(history1).toEqual(history2); // Same content
    });

    it('should return last score entry', () => {
      const lastEntry = scoreManager.getLastScoreEntry();
      
      expect(lastEntry).toEqual({
        questionNumber: 3,
        countryName: 'Italy',
        hintsUsed: 2,
        pointsAwarded: 0,
        isCorrect: false
      });
    });
  });

  describe('getScoreStats', () => {
    it('should return empty stats for no questions', () => {
      const stats = scoreManager.getScoreStats();
      
      expect(stats).toEqual({
        totalScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        averageHintsUsed: 0,
        perfectAnswers: 0,
        scorePercentage: 0
      });
    });

    it('should calculate comprehensive stats', () => {
      scoreManager.addScore('France', 0, true); // Perfect answer
      scoreManager.addScore('Germany', 1, true); // Good answer
      scoreManager.addScore('Italy', 2, true); // OK answer
      scoreManager.addScore('Spain', 1, false); // Wrong answer
      
      const stats = scoreManager.getScoreStats();
      
      expect(stats.totalScore).toBe(6); // 3 + 2 + 1 + 0
      expect(stats.totalQuestions).toBe(4);
      expect(stats.correctAnswers).toBe(3);
      expect(stats.averageHintsUsed).toBe(1); // (0 + 1 + 2 + 1) / 4
      expect(stats.perfectAnswers).toBe(1);
      expect(stats.scorePercentage).toBe(50); // 6/12 * 100
    });

    it('should handle rounding for score percentage', () => {
      scoreManager.addScore('France', 0, true); // 3 points
      scoreManager.addScore('Germany', 1, true); // 2 points
      // Total: 5/6 = 83.333...%
      
      const stats = scoreManager.getScoreStats();
      expect(stats.scorePercentage).toBe(83.33);
    });
  });

  describe('getScoringBreakdown', () => {
    it('should return empty breakdown for no questions', () => {
      const breakdown = scoreManager.getScoringBreakdown();
      
      expect(breakdown).toEqual({
        noHints: 0,
        oneHint: 0,
        multipleHints: 0,
        incorrect: 0
      });
    });

    it('should categorize answers correctly', () => {
      scoreManager.addScore('France', 0, true); // No hints
      scoreManager.addScore('Germany', 0, true); // No hints
      scoreManager.addScore('Italy', 1, true); // One hint
      scoreManager.addScore('Spain', 2, true); // Multiple hints
      scoreManager.addScore('UK', 3, true); // Multiple hints
      scoreManager.addScore('USA', 1, false); // Incorrect
      scoreManager.addScore('Canada', 0, false); // Incorrect
      
      const breakdown = scoreManager.getScoringBreakdown();
      
      expect(breakdown.noHints).toBe(2);
      expect(breakdown.oneHint).toBe(1);
      expect(breakdown.multipleHints).toBe(2);
      expect(breakdown.incorrect).toBe(2);
    });
  });

  describe('utility methods', () => {
    beforeEach(() => {
      scoreManager.addScore('France', 0, true); // 3 points
      scoreManager.addScore('Germany', 1, true); // 2 points
      scoreManager.addScore('Italy', 2, false); // 0 points
    });

    it('should generate score summary', () => {
      const summary = scoreManager.getScoreSummary();
      
      expect(summary).toContain('Final Score: 5/9 (55.56%)');
      expect(summary).toContain('Questions Answered: 3');
      expect(summary).toContain('Correct Answers: 2');
      expect(summary).toContain('Perfect Answers: 1');
      expect(summary).toContain('Average Hints Used: 1');
    });

    it('should return empty summary for no questions', () => {
      const emptyManager = new ScoreManager();
      const summary = emptyManager.getScoreSummary();
      
      expect(summary).toBe('No questions answered yet.');
    });

    it('should detect perfect score', () => {
      const perfectManager = new ScoreManager();
      perfectManager.addScore('France', 0, true);
      perfectManager.addScore('Germany', 0, true);
      
      expect(perfectManager.isPerfectScore()).toBe(true);
    });

    it('should detect non-perfect score', () => {
      expect(scoreManager.isPerfectScore()).toBe(false);
    });

    it('should calculate score efficiency', () => {
      expect(scoreManager.getScoreEfficiency()).toBeCloseTo(55.56, 2);
    });

    it('should return 0 efficiency for no questions', () => {
      const emptyManager = new ScoreManager();
      expect(emptyManager.getScoreEfficiency()).toBe(0);
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      scoreManager.addScore('France', 0, true);
      scoreManager.addScore('Germany', 1, true);
      
      scoreManager.reset();
      
      expect(scoreManager.getCurrentScore()).toBe(0);
      expect(scoreManager.getTotalQuestions()).toBe(0);
      expect(scoreManager.getScoreHistory()).toHaveLength(0);
      expect(scoreManager.getLastScoreEntry()).toBeNull();
    });
  });
});