import { ScoreManager, ScoreEntry } from './ScoreManager';

export interface ProgressDisplay {
  currentScore: number;
  maxPossibleScore: number;
  questionsAnswered: number;
  scorePercentage: number;
  lastQuestionPoints: number | null;
  streak: {
    current: number;
    best: number;
    type: 'correct' | 'perfect' | 'none';
  };
}

export interface DetailedProgress {
  overall: ProgressDisplay;
  recentPerformance: {
    lastFiveQuestions: ScoreEntry[];
    recentAccuracy: number;
    recentAverageHints: number;
  };
  achievements: {
    perfectAnswers: number;
    noHintStreak: number;
    totalCorrect: number;
    efficiency: number;
  };
}

export class GameProgressTracker {
  private scoreManager: ScoreManager;

  constructor(scoreManager: ScoreManager) {
    this.scoreManager = scoreManager;
  }

  /**
   * Gets current progress display information
   */
  public getProgressDisplay(): ProgressDisplay {
    const stats = this.scoreManager.getScoreStats();
    const lastEntry = this.scoreManager.getLastScoreEntry();
    const streak = this.calculateStreak();

    return {
      currentScore: stats.totalScore,
      maxPossibleScore: this.scoreManager.getMaxPossibleScore(),
      questionsAnswered: stats.totalQuestions,
      scorePercentage: stats.scorePercentage,
      lastQuestionPoints: lastEntry?.pointsAwarded || null,
      streak
    };
  }

  /**
   * Gets detailed progress information
   */
  public getDetailedProgress(): DetailedProgress {
    const overall = this.getProgressDisplay();
    const history = this.scoreManager.getScoreHistory();
    const stats = this.scoreManager.getScoreStats();
    
    // Get last 5 questions for recent performance
    const lastFiveQuestions = history.slice(-5);
    const recentCorrect = lastFiveQuestions.filter(q => q.isCorrect).length;
    const recentAccuracy = lastFiveQuestions.length > 0 ? (recentCorrect / lastFiveQuestions.length) * 100 : 0;
    const recentTotalHints = lastFiveQuestions.reduce((sum, q) => sum + q.hintsUsed, 0);
    const recentAverageHints = lastFiveQuestions.length > 0 ? recentTotalHints / lastFiveQuestions.length : 0;

    return {
      overall,
      recentPerformance: {
        lastFiveQuestions,
        recentAccuracy: Math.round(recentAccuracy * 100) / 100,
        recentAverageHints: Math.round(recentAverageHints * 100) / 100
      },
      achievements: {
        perfectAnswers: stats.perfectAnswers,
        noHintStreak: this.calculateNoHintStreak(),
        totalCorrect: stats.correctAnswers,
        efficiency: Math.round(this.scoreManager.getScoreEfficiency() * 100) / 100
      }
    };
  }

  /**
   * Calculates current streak information
   */
  private calculateStreak(): { current: number; best: number; type: 'correct' | 'perfect' | 'none' } {
    const history = this.scoreManager.getScoreHistory();
    
    if (history.length === 0) {
      return { current: 0, best: 0, type: 'none' };
    }

    // Calculate current streaks from the end (most recent)
    let currentCorrectStreak = 0;
    let currentPerfectStreak = 0;
    
    for (let i = history.length - 1; i >= 0; i--) {
      const entry = history[i];
      
      if (entry.isCorrect) {
        currentCorrectStreak++;
        if (entry.hintsUsed === 0) {
          currentPerfectStreak++;
        } else {
          // If this correct answer used hints, we can't extend the perfect streak
          if (currentPerfectStreak === currentCorrectStreak - 1) {
            currentPerfectStreak = 0;
          }
        }
      } else {
        // Incorrect answer breaks both streaks
        break;
      }
    }

    // Calculate best streaks by going through entire history
    let bestCorrectStreak = 0;
    let bestPerfectStreak = 0;
    let tempCorrectStreak = 0;
    let tempPerfectStreak = 0;

    for (const entry of history) {
      if (entry.isCorrect) {
        tempCorrectStreak++;
        bestCorrectStreak = Math.max(bestCorrectStreak, tempCorrectStreak);
        
        if (entry.hintsUsed === 0) {
          tempPerfectStreak++;
          bestPerfectStreak = Math.max(bestPerfectStreak, tempPerfectStreak);
        } else {
          tempPerfectStreak = 0;
        }
      } else {
        tempCorrectStreak = 0;
        tempPerfectStreak = 0;
      }
    }

    // Determine primary streak type and values
    let type: 'correct' | 'perfect' | 'none' = 'none';
    let current = 0;
    let best = 0;

    if (currentPerfectStreak > 0 && currentPerfectStreak === currentCorrectStreak) {
      // All current correct answers are perfect
      type = 'perfect';
      current = currentPerfectStreak;
      best = bestPerfectStreak;
    } else if (currentCorrectStreak > 0) {
      // We have correct answers, but not all are perfect
      type = 'correct';
      current = currentCorrectStreak;
      best = bestCorrectStreak;
    }

    return { current, best, type };
  }

  /**
   * Calculates the longest streak of answers without hints
   */
  private calculateNoHintStreak(): number {
    const history = this.scoreManager.getScoreHistory();
    let maxStreak = 0;
    let currentStreak = 0;

    for (const entry of history) {
      if (entry.isCorrect && entry.hintsUsed === 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  }

  /**
   * Gets a formatted progress summary
   */
  public getProgressSummary(): string {
    const progress = this.getProgressDisplay();
    
    if (progress.questionsAnswered === 0) {
      return "Ready to start! Answer questions to track your progress.";
    }

    const lines = [
      `Score: ${progress.currentScore}/${progress.maxPossibleScore} (${progress.scorePercentage}%)`,
      `Questions: ${progress.questionsAnswered}`
    ];

    if (progress.lastQuestionPoints !== null) {
      lines.push(`Last Question: +${progress.lastQuestionPoints} points`);
    }

    if (progress.streak.current > 0) {
      const streakType = progress.streak.type === 'perfect' ? 'perfect' : 'correct';
      lines.push(`${streakType.charAt(0).toUpperCase() + streakType.slice(1)} Streak: ${progress.streak.current}`);
    }

    return lines.join(' | ');
  }

  /**
   * Gets achievement notifications for the last question
   */
  public getAchievementNotifications(): string[] {
    const notifications: string[] = [];
    const lastEntry = this.scoreManager.getLastScoreEntry();
    
    if (!lastEntry) {
      return notifications;
    }

    // Perfect answer achievement
    if (lastEntry.isCorrect && lastEntry.hintsUsed === 0) {
      notifications.push("🎯 Perfect Answer! No hints needed!");
    }

    // Streak achievements
    const streak = this.calculateStreak();
    if (streak.current > 1) {
      if (streak.type === 'perfect' && streak.current >= 3) {
        notifications.push(`🔥 Perfect Streak: ${streak.current} in a row!`);
      } else if (streak.type === 'correct' && streak.current >= 5) {
        notifications.push(`⭐ Correct Streak: ${streak.current} in a row!`);
      }
    }

    // Milestone achievements
    const stats = this.scoreManager.getScoreStats();
    if (stats.totalQuestions === 10) {
      notifications.push("🏆 Milestone: 10 questions completed!");
    } else if (stats.totalQuestions === 25) {
      notifications.push("🏆 Milestone: 25 questions completed!");
    } else if (stats.totalQuestions === 50) {
      notifications.push("🏆 Milestone: 50 questions completed!");
    }

    // High efficiency achievement
    if (stats.totalQuestions >= 5 && stats.scorePercentage >= 90) {
      notifications.push("💎 High Efficiency: 90%+ score rate!");
    }

    return notifications;
  }

  /**
   * Checks if the player is on a notable streak
   */
  public hasNotableStreak(): boolean {
    const streak = this.calculateStreak();
    return (streak.type === 'perfect' && streak.current >= 3) || 
           (streak.type === 'correct' && streak.current >= 5);
  }

  /**
   * Gets performance trend over recent questions
   */
  public getPerformanceTrend(): 'improving' | 'declining' | 'stable' | 'insufficient_data' {
    const history = this.scoreManager.getScoreHistory();
    
    if (history.length < 6) {
      return 'insufficient_data';
    }

    const recent = history.slice(-3);
    const previous = history.slice(-6, -3);
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.pointsAwarded, 0) / recent.length;
    const previousAvg = previous.reduce((sum, entry) => sum + entry.pointsAwarded, 0) / previous.length;
    
    const difference = recentAvg - previousAvg;
    
    if (Math.abs(difference) < 0.3) {
      return 'stable';
    }
    
    return difference > 0 ? 'improving' : 'declining';
  }
}