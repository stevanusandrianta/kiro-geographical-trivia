import { QuestionManager } from '../QuestionManager';
import { Country } from '../../data/countries';
import { QuizCategory } from '../../types/game';
import { SCORING } from '../../types/game';

describe('QuestionManager', () => {
  let questionManager: QuestionManager;
  let mockCountry: Country;

  beforeEach(() => {
    questionManager = new QuestionManager();
    mockCountry = {
      name: 'France',
      capital: 'Paris',
      continent: 'Europe',
      subContinent: 'Western Europe',
      population: 67800000,
      mainLanguage: 'French',
      mainAirport: 'Charles de Gaulle Airport (CDG)',
      currency: 'Euro',
      area: 643801,
      flagEmoji: '🇫🇷'
    };
  });

  describe('createQuestion', () => {
    it('should create a new question with all hints available', () => {
      const question = questionManager.createQuestion(mockCountry, QuizCategory.COUNTRY_TO_CAPITAL);
      
      expect(question.country).toBe(mockCountry);
      expect(question.hintsAvailable).toHaveLength(3);
      expect(question.hintsRevealed).toHaveLength(0);
      expect(question.attempts).toHaveLength(0);
      expect(question.isCompleted).toBe(false);
      expect(question.pointsAwarded).toBe(0);
    });

    it('should generate correct hints for the capital', () => {
      const question = questionManager.createQuestion(mockCountry, QuizCategory.COUNTRY_TO_CAPITAL);
      
      expect(question.hintsAvailable[0]).toBe('The capital has 5 letters.');
      expect(question.hintsAvailable[1]).toBe('The capital starts with "P".');
      expect(question.hintsAvailable[2]).toBe('The capital starts with "P" and ends with "S".');
    });

    it('should set the question as current', () => {
      const question = questionManager.createQuestion(mockCountry, QuizCategory.COUNTRY_TO_CAPITAL);
      expect(questionManager.getCurrentQuestion()).toBe(question);
    });
  });

  describe('requestHint', () => {
    beforeEach(() => {
      questionManager.createQuestion(mockCountry, QuizCategory.COUNTRY_TO_CAPITAL);
    });

    it('should return the first hint on first request', () => {
      const hint = questionManager.requestHint();
      expect(hint).toBe('The capital has 5 letters.');
    });

    it('should return the second hint on second request', () => {
      questionManager.requestHint(); // First hint
      const hint = questionManager.requestHint();
      expect(hint).toBe('The capital starts with "P".');
    });

    it('should return the third hint on third request', () => {
      questionManager.requestHint(); // First hint
      questionManager.requestHint(); // Second hint
      const hint = questionManager.requestHint();
      expect(hint).toBe('The capital starts with "P" and ends with "S".');
    });

    it('should return null when no more hints available', () => {
      questionManager.requestHint(); // First hint
      questionManager.requestHint(); // Second hint
      questionManager.requestHint(); // Third hint
      const hint = questionManager.requestHint();
      expect(hint).toBeNull();
    });

    it('should track revealed hints', () => {
      questionManager.requestHint();
      questionManager.requestHint();
      
      const revealedHints = questionManager.getRevealedHints();
      expect(revealedHints).toHaveLength(2);
      expect(revealedHints[0]).toBe('The capital has 5 letters.');
      expect(revealedHints[1]).toBe('The capital starts with "P".');
    });

    it('should throw error when no active question', () => {
      questionManager.reset();
      expect(() => questionManager.requestHint()).toThrow('No active question to provide hint for');
    });

    it('should throw error when question is completed', () => {
      questionManager.completeQuestion(true);
      expect(() => questionManager.requestHint()).toThrow('Cannot request hint for completed question');
    });
  });

  describe('hint tracking methods', () => {
    beforeEach(() => {
      questionManager.createQuestion(mockCountry, QuizCategory.COUNTRY_TO_CAPITAL);
    });

    it('should track hints used correctly', () => {
      expect(questionManager.getHintsUsed()).toBe(0);
      
      questionManager.requestHint();
      expect(questionManager.getHintsUsed()).toBe(1);
      
      questionManager.requestHint();
      expect(questionManager.getHintsUsed()).toBe(2);
    });

    it('should track hints remaining correctly', () => {
      expect(questionManager.getHintsRemaining()).toBe(3);
      
      questionManager.requestHint();
      expect(questionManager.getHintsRemaining()).toBe(2);
      
      questionManager.requestHint();
      expect(questionManager.getHintsRemaining()).toBe(1);
      
      questionManager.requestHint();
      expect(questionManager.getHintsRemaining()).toBe(0);
    });

    it('should correctly report if more hints are available', () => {
      expect(questionManager.hasMoreHints()).toBe(true);
      
      questionManager.requestHint();
      questionManager.requestHint();
      expect(questionManager.hasMoreHints()).toBe(true);
      
      questionManager.requestHint();
      expect(questionManager.hasMoreHints()).toBe(false);
    });
  });

  describe('addAttempt', () => {
    beforeEach(() => {
      questionManager.createQuestion(mockCountry, QuizCategory.COUNTRY_TO_CAPITAL);
    });

    it('should add attempts to the question', () => {
      questionManager.addAttempt('London');
      questionManager.addAttempt('Berlin');
      
      const question = questionManager.getCurrentQuestion();
      expect(question?.attempts).toEqual(['London', 'Berlin']);
    });

    it('should throw error when no active question', () => {
      questionManager.reset();
      expect(() => questionManager.addAttempt('Paris')).toThrow('No active question to add attempt to');
    });

    it('should throw error when question is completed', () => {
      questionManager.completeQuestion(true);
      expect(() => questionManager.addAttempt('Paris')).toThrow('Cannot add attempt to completed question');
    });
  });

  describe('completeQuestion', () => {
    beforeEach(() => {
      questionManager.createQuestion(mockCountry, QuizCategory.COUNTRY_TO_CAPITAL);
    });

    it('should award 3 points for correct answer without hints', () => {
      const points = questionManager.completeQuestion(true);
      expect(points).toBe(SCORING.CORRECT_FIRST_TRY);
      
      const question = questionManager.getCurrentQuestion();
      expect(question?.pointsAwarded).toBe(SCORING.CORRECT_FIRST_TRY);
      expect(question?.isCompleted).toBe(true);
    });

    it('should award 2 points for correct answer after 1 hint', () => {
      questionManager.requestHint();
      const points = questionManager.completeQuestion(true);
      expect(points).toBe(SCORING.CORRECT_AFTER_ONE_HINT);
    });

    it('should award 1 point for correct answer after multiple hints', () => {
      questionManager.requestHint();
      questionManager.requestHint();
      const points = questionManager.completeQuestion(true);
      expect(points).toBe(SCORING.CORRECT_AFTER_MULTIPLE_HINTS);
    });

    it('should award 0 points for incorrect answer', () => {
      questionManager.requestHint();
      const points = questionManager.completeQuestion(false);
      expect(points).toBe(SCORING.INCORRECT_AFTER_ALL_HINTS);
    });

    it('should throw error when no active question', () => {
      questionManager.reset();
      expect(() => questionManager.completeQuestion(true)).toThrow('No active question to complete');
    });

    it('should throw error when question already completed', () => {
      questionManager.completeQuestion(true);
      expect(() => questionManager.completeQuestion(true)).toThrow('Question is already completed');
    });
  });

  describe('getQuestionStats', () => {
    it('should return empty stats when no active question', () => {
      const stats = questionManager.getQuestionStats();
      expect(stats).toEqual({
        hintsUsed: 0,
        hintsRemaining: 0,
        attempts: 0,
        isCompleted: false
      });
    });

    it('should return correct stats for active question', () => {
      questionManager.createQuestion(mockCountry, QuizCategory.COUNTRY_TO_CAPITAL);
      questionManager.requestHint();
      questionManager.addAttempt('London');
      questionManager.addAttempt('Berlin');
      
      const stats = questionManager.getQuestionStats();
      expect(stats).toEqual({
        hintsUsed: 1,
        hintsRemaining: 2,
        attempts: 2,
        isCompleted: false
      });
    });

    it('should show completed status after completion', () => {
      questionManager.createQuestion(mockCountry, QuizCategory.COUNTRY_TO_CAPITAL);
      questionManager.completeQuestion(true);
      
      const stats = questionManager.getQuestionStats();
      expect(stats.isCompleted).toBe(true);
    });
  });

  describe('reset', () => {
    it('should clear the current question', () => {
      questionManager.createQuestion(mockCountry, QuizCategory.COUNTRY_TO_CAPITAL);
      expect(questionManager.getCurrentQuestion()).not.toBeNull();
      
      questionManager.reset();
      expect(questionManager.getCurrentQuestion()).toBeNull();
    });
  });
});