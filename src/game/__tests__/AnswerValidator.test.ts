import { AnswerValidator } from '../AnswerValidator';

describe('AnswerValidator', () => {
  let validator: AnswerValidator;

  beforeEach(() => {
    validator = new AnswerValidator();
  });

  describe('validateAnswer - basic functionality', () => {
    it('should return correct for exact match', () => {
      const result = validator.validateAnswer('Paris', 'Paris');
      expect(result.isCorrect).toBe(true);
      expect(result.message).toBe('Correct! Well done!');
    });

    it('should be case-insensitive', () => {
      const result = validator.validateAnswer('LONDON', 'London');
      expect(result.isCorrect).toBe(true);
    });

    it('should handle mixed case', () => {
      const result = validator.validateAnswer('ToKyO', 'Tokyo');
      expect(result.isCorrect).toBe(true);
    });

    it('should trim whitespace from input', () => {
      const result = validator.validateAnswer('  Berlin  ', 'Berlin');
      expect(result.isCorrect).toBe(true);
    });

    it('should trim whitespace from correct answer', () => {
      const result = validator.validateAnswer('Rome', '  Rome  ');
      expect(result.isCorrect).toBe(true);
    });

    it('should return incorrect for wrong answer', () => {
      const result = validator.validateAnswer('Madrid', 'Paris');
      expect(result.isCorrect).toBe(false);
      expect(result.message).toBe('Incorrect. Try again or request a hint!');
    });

    it('should handle empty input', () => {
      const result = validator.validateAnswer('', 'Paris');
      expect(result.isCorrect).toBe(false);
    });
  });

  describe('validateAnswer - alternative names', () => {
    it('should accept "Washington" for "Washington D.C."', () => {
      const result = validator.validateAnswer('Washington', 'Washington D.C.');
      expect(result.isCorrect).toBe(true);
    });

    it('should accept "DC" for "Washington D.C."', () => {
      const result = validator.validateAnswer('DC', 'Washington D.C.');
      expect(result.isCorrect).toBe(true);
    });

    it('should accept "Delhi" for "New Delhi"', () => {
      const result = validator.validateAnswer('Delhi', 'New Delhi');
      expect(result.isCorrect).toBe(true);
    });

    it('should accept "Capetown" for "Cape Town"', () => {
      const result = validator.validateAnswer('Capetown', 'Cape Town');
      expect(result.isCorrect).toBe(true);
    });

    it('should be case-insensitive with alternatives', () => {
      const result = validator.validateAnswer('washington', 'Washington D.C.');
      expect(result.isCorrect).toBe(true);
    });
  });

  describe('validateAnswer - fuzzy matching', () => {
    it('should detect close match with minor typo', () => {
      const result = validator.validateAnswer('Pariz', 'Paris');
      expect(result.isCorrect).toBe(false);
      expect(result.isClose).toBe(true);
      expect(result.suggestion).toBe('Paris');
      expect(result.message).toContain('Very close!');
    });

    it('should detect close match with missing letter', () => {
      const result = validator.validateAnswer('Londo', 'London');
      expect(result.isCorrect).toBe(false);
      expect(result.isClose).toBe(true);
      expect(result.suggestion).toBe('London');
    });

    it('should detect close match with extra letter', () => {
      const result = validator.validateAnswer('Berlinn', 'Berlin');
      expect(result.isCorrect).toBe(false);
      expect(result.isClose).toBe(true);
      expect(result.suggestion).toBe('Berlin');
    });

    it('should not consider very different words as close', () => {
      const result = validator.validateAnswer('Madrid', 'Tokyo');
      expect(result.isCorrect).toBe(false);
      expect(result.isClose).toBe(false);
    });

    it('should not consider short words with big differences as close', () => {
      const result = validator.validateAnswer('AB', 'XY');
      expect(result.isCorrect).toBe(false);
      expect(result.isClose).toBe(false);
    });

    it('should handle case-insensitive fuzzy matching', () => {
      const result = validator.validateAnswer('PARIZ', 'Paris');
      expect(result.isCorrect).toBe(false);
      expect(result.isClose).toBe(true);
    });
  });

  describe('isValidInput', () => {
    it('should return true for valid input', () => {
      expect(validator.isValidInput('Paris')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(validator.isValidInput('')).toBe(false);
    });

    it('should return false for whitespace only', () => {
      expect(validator.isValidInput('   ')).toBe(false);
    });

    it('should return true for input with surrounding whitespace', () => {
      expect(validator.isValidInput('  London  ')).toBe(true);
    });
  });
});