import { GameProgressTracker } from '../GameProgressTracker';
import { ScoreManager } from '../ScoreManager';

describe('GameProgressTracker', () => {
  let scoreManager: ScoreManager;
  let progressTracker: GameProgressTracker;

  beforeEach(() => {
    scoreManager = new ScoreManager();
    progressTracker = new GameProgressTracker(scoreManager);
  });

  describe('getProgressDisplay', () => {
    it('should return empty progress for no questions', () => {
      const progress = progressTracker.getProgressDisplay();
      
      expect(progress).toEqual({
        currentScore: 0,
        maxPossibleScore: 0,
        questionsAnswered: 0,
        scorePercentage: 0,
        lastQuestionPoints: null,
        streak: {
          current: 0,
          best: 0,
          type: 'none'
        }
      });
    });

    it('should return correct progress after questions', () => {
      scoreManager.addScore('France', 0, true); // 3 points
      scoreManager.addScore('Germany', 1, true); // 2 points
      
      const progress = progressTracker.getProgressDisplay();
      
      expect(progress.currentScore).toBe(5);
      expect(progress.maxPossibleScore).toBe(6);
      expect(progress.questionsAnswered).toBe(2);
      expect(progress.scorePercentage).toBeCloseTo(83.33, 2);
      expect(progress.lastQuestionPoints).toBe(2);
    });
  });

  describe('streak calculation', () => {
    it('should track correct answer streak', () => {
      scoreManager.addScore('France', 1, true);
      scoreManager.addScore('Germany', 2, true);
      scoreManager.addScore('Italy', 1, true);
      
      const progress = progressTracker.getProgressDisplay();
      
      expect(progress.streak.current).toBe(3);
      expect(progress.streak.best).toBe(3);
      expect(progress.streak.type).toBe('correct');
    });

    it('should track perfect answer streak', () => {
      scoreManager.addScore('France', 0, true);
      scoreManager.addScore('Germany', 0, true);
      scoreManager.addScore('Italy', 0, true);
      
      const progress = progressTracker.getProgressDisplay();
      
      expect(progress.streak.current).toBe(3);
      expect(progress.streak.best).toBe(3);
      expect(progress.streak.type).toBe('perfect');
    });

    it('should break streak on incorrect answer', () => {
      scoreManager.addScore('France', 0, true);
      scoreManager.addScore('Germany', 0, true);
      scoreManager.addScore('Italy', 1, false); // Breaks streak
      scoreManager.addScore('Spain', 0, true);
      
      const progress = progressTracker.getProgressDisplay();
      
      expect(progress.streak.current).toBe(1);
      expect(progress.streak.best).toBe(2);
      expect(progress.streak.type).toBe('perfect');
    });

    it('should prioritize perfect streak over correct streak', () => {
      scoreManager.addScore('France', 0, true); // Perfect
      scoreManager.addScore('Germany', 1, true); // Correct but not perfect
      scoreManager.addScore('Italy', 0, true); // Perfect again
      
      const progress = progressTracker.getProgressDisplay();
      
      expect(progress.streak.current).toBe(3); // All correct
      expect(progress.streak.type).toBe('correct'); // Not all perfect
    });
  });

  describe('getDetailedProgress', () => {
    beforeEach(() => {
      // Add 7 questions for comprehensive testing
      scoreManager.addScore('France', 0, true); // Perfect
      scoreManager.addScore('Germany', 1, true); // Good
      scoreManager.addScore('Italy', 2, false); // Wrong
      scoreManager.addScore('Spain', 0, true); // Perfect
      scoreManager.addScore('UK', 1, true); // Good
      scoreManager.addScore('USA', 0, true); // Perfect
      scoreManager.addScore('Canada', 2, true); // OK
    });

    it('should calculate recent performance correctly', () => {
      const detailed = progressTracker.getDetailedProgress();
      
      // Last 5 questions: Italy(wrong), Spain(perfect), UK(good), USA(perfect), Canada(ok)
      expect(detailed.recentPerformance.lastFiveQuestions).toHaveLength(5);
      expect(detailed.recentPerformance.recentAccuracy).toBe(80); // 4/5 correct
      expect(detailed.recentPerformance.recentAverageHints).toBe(0.8); // (2+0+1+0+2)/5
    });

    it('should calculate achievements correctly', () => {
      const detailed = progressTracker.getDetailedProgress();
      
      expect(detailed.achievements.perfectAnswers).toBe(3); // France, Spain, USA
      expect(detailed.achievements.totalCorrect).toBe(6); // All except Italy
      expect(detailed.achievements.noHintStreak).toBe(1); // USA is the longest single streak
    });
  });

  describe('getProgressSummary', () => {
    it('should return ready message for no questions', () => {
      const summary = progressTracker.getProgressSummary();
      expect(summary).toBe("Ready to start! Answer questions to track your progress.");
    });

    it('should return formatted summary with score and streak', () => {
      scoreManager.addScore('France', 0, true);
      scoreManager.addScore('Germany', 0, true);
      
      const summary = progressTracker.getProgressSummary();
      
      expect(summary).toContain('Score: 6/6 (100%)');
      expect(summary).toContain('Questions: 2');
      expect(summary).toContain('Last Question: +3 points');
      expect(summary).toContain('Perfect Streak: 2');
    });
  });

  describe('getAchievementNotifications', () => {
    it('should return empty array for no questions', () => {
      const notifications = progressTracker.getAchievementNotifications();
      expect(notifications).toEqual([]);
    });

    it('should notify perfect answer', () => {
      scoreManager.addScore('France', 0, true);
      
      const notifications = progressTracker.getAchievementNotifications();
      expect(notifications).toContain("🎯 Perfect Answer! No hints needed!");
    });

    it('should notify perfect streak', () => {
      scoreManager.addScore('France', 0, true);
      scoreManager.addScore('Germany', 0, true);
      scoreManager.addScore('Italy', 0, true);
      
      const notifications = progressTracker.getAchievementNotifications();
      expect(notifications).toContain("🔥 Perfect Streak: 3 in a row!");
    });

    it('should notify correct streak', () => {
      for (let i = 0; i < 5; i++) {
        scoreManager.addScore(`Country${i}`, 1, true);
      }
      
      const notifications = progressTracker.getAchievementNotifications();
      expect(notifications).toContain("⭐ Correct Streak: 5 in a row!");
    });

    it('should notify milestone achievements', () => {
      for (let i = 0; i < 10; i++) {
        scoreManager.addScore(`Country${i}`, 1, true);
      }
      
      const notifications = progressTracker.getAchievementNotifications();
      expect(notifications).toContain("🏆 Milestone: 10 questions completed!");
    });

    it('should notify high efficiency', () => {
      // Add 5 perfect answers for 100% efficiency
      for (let i = 0; i < 5; i++) {
        scoreManager.addScore(`Country${i}`, 0, true);
      }
      
      const notifications = progressTracker.getAchievementNotifications();
      expect(notifications).toContain("💎 High Efficiency: 90%+ score rate!");
    });
  });

  describe('hasNotableStreak', () => {
    it('should return false for no streak', () => {
      expect(progressTracker.hasNotableStreak()).toBe(false);
    });

    it('should return true for perfect streak of 3+', () => {
      scoreManager.addScore('France', 0, true);
      scoreManager.addScore('Germany', 0, true);
      scoreManager.addScore('Italy', 0, true);
      
      expect(progressTracker.hasNotableStreak()).toBe(true);
    });

    it('should return true for correct streak of 5+', () => {
      for (let i = 0; i < 5; i++) {
        scoreManager.addScore(`Country${i}`, 1, true);
      }
      
      expect(progressTracker.hasNotableStreak()).toBe(true);
    });

    it('should return false for short streaks', () => {
      scoreManager.addScore('France', 0, true);
      scoreManager.addScore('Germany', 0, true); // Only 2 perfect
      
      expect(progressTracker.hasNotableStreak()).toBe(false);
    });
  });

  describe('getPerformanceTrend', () => {
    it('should return insufficient_data for less than 6 questions', () => {
      scoreManager.addScore('France', 0, true);
      
      const trend = progressTracker.getPerformanceTrend();
      expect(trend).toBe('insufficient_data');
    });

    it('should detect improving trend', () => {
      // Previous 3: low scores
      scoreManager.addScore('Country1', 3, false); // 0 points
      scoreManager.addScore('Country2', 2, true); // 1 point
      scoreManager.addScore('Country3', 3, false); // 0 points
      
      // Recent 3: high scores
      scoreManager.addScore('Country4', 0, true); // 3 points
      scoreManager.addScore('Country5', 0, true); // 3 points
      scoreManager.addScore('Country6', 1, true); // 2 points
      
      const trend = progressTracker.getPerformanceTrend();
      expect(trend).toBe('improving');
    });

    it('should detect declining trend', () => {
      // Previous 3: high scores
      scoreManager.addScore('Country1', 0, true); // 3 points
      scoreManager.addScore('Country2', 0, true); // 3 points
      scoreManager.addScore('Country3', 1, true); // 2 points
      
      // Recent 3: low scores
      scoreManager.addScore('Country4', 3, false); // 0 points
      scoreManager.addScore('Country5', 2, true); // 1 point
      scoreManager.addScore('Country6', 3, false); // 0 points
      
      const trend = progressTracker.getPerformanceTrend();
      expect(trend).toBe('declining');
    });

    it('should detect stable trend', () => {
      // All similar scores
      for (let i = 0; i < 6; i++) {
        scoreManager.addScore(`Country${i}`, 1, true); // All 2 points
      }
      
      const trend = progressTracker.getPerformanceTrend();
      expect(trend).toBe('stable');
    });
  });
});