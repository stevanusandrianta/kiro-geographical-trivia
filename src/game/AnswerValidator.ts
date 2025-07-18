import { ValidationResult } from '../types/game';

export class AnswerValidator {
  // Common alternative names for capitals
  private alternativeNames: Record<string, string[]> = {
    'washington d.c.': ['washington', 'dc', 'washington dc'],
    'new delhi': ['delhi'],
    'cape town': ['capetown'],
    'buenos aires': ['buenos aires city'],
    'mexico city': ['ciudad de mexico', 'cdmx'],
    'rio de janeiro': ['rio'],
    'sao paulo': ['são paulo'],
    'saint petersburg': ['st petersburg', 'petersburg'],
    'los angeles': ['la', 'los angeles city'],
    'new york': ['nyc', 'new york city']
  };

  /**
   * Normalizes input by trimming whitespace and converting to lowercase
   */
  private normalize(input: string): string {
    return input.trim().toLowerCase();
  }

  /**
   * Calculates Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Checks if the input is close to the correct answer using fuzzy matching
   */
  private isCloseMatch(input: string, correct: string): boolean {
    const distance = this.levenshteinDistance(input, correct);
    const maxLength = Math.max(input.length, correct.length);
    const similarity = 1 - (distance / maxLength);
    
    // Consider it close if similarity is above 70% and at least 3 characters long
    return similarity >= 0.7 && maxLength >= 3;
  }

  /**
   * Gets all possible valid answers including alternatives
   */
  private getAllValidAnswers(correctAnswer: string): string[] {
    const normalized = this.normalize(correctAnswer);
    const alternatives = this.alternativeNames[normalized] || [];
    return [normalized, ...alternatives];
  }

  /**
   * Performs comprehensive answer validation with alternatives and fuzzy matching
   */
  public validateAnswer(userInput: string, correctAnswer: string): ValidationResult {
    const normalizedInput = this.normalize(userInput);
    const validAnswers = this.getAllValidAnswers(correctAnswer);

    // Check for exact match (including alternatives)
    if (validAnswers.includes(normalizedInput)) {
      return {
        isCorrect: true,
        isClose: false,
        message: 'Correct! Well done!'
      };
    }

    // Check for close matches using fuzzy matching
    const normalizedCorrect = this.normalize(correctAnswer);
    if (this.isCloseMatch(normalizedInput, normalizedCorrect)) {
      return {
        isCorrect: false,
        isClose: true,
        suggestion: correctAnswer,
        message: `Very close! Did you mean "${correctAnswer}"?`
      };
    }

    // Check if close to any alternative
    for (const alternative of validAnswers.slice(1)) {
      if (this.isCloseMatch(normalizedInput, alternative)) {
        return {
          isCorrect: false,
          isClose: true,
          suggestion: correctAnswer,
          message: `Close! The answer is "${correctAnswer}".`
        };
      }
    }

    return {
      isCorrect: false,
      isClose: false,
      message: 'Incorrect. Try again or request a hint!'
    };
  }

  /**
   * Checks if the input is empty or invalid
   */
  public isValidInput(input: string): boolean {
    return input.trim().length > 0;
  }
}