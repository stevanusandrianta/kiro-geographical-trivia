import { HintSystem } from '../HintSystem';

describe('HintSystem', () => {
  let hintSystem: HintSystem;

  beforeEach(() => {
    hintSystem = new HintSystem();
  });

  describe('generateHint', () => {
    it('should generate level 1 hint (number of letters)', () => {
      const hint = hintSystem.generateHint('Paris', 1);
      expect(hint).toBe('The capital has 5 letters.');
    });

    it('should generate level 2 hint (first letter)', () => {
      const hint = hintSystem.generateHint('London', 2);
      expect(hint).toBe('The capital starts with "L".');
    });

    it('should generate level 3 hint (first and last letters)', () => {
      const hint = hintSystem.generateHint('Berlin', 3);
      expect(hint).toBe('The capital starts with "B" and ends with "N".');
    });

    it('should handle single letter capitals', () => {
      const hint = hintSystem.generateHint('A', 1);
      expect(hint).toBe('The capital has 1 letters.');
    });

    it('should handle capitals with spaces', () => {
      const hint = hintSystem.generateHint('New York', 1);
      expect(hint).toBe('The capital has 8 letters.');
    });

    it('should capitalize first letter correctly', () => {
      const hint = hintSystem.generateHint('tokyo', 2);
      expect(hint).toBe('The capital starts with "T".');
    });

    it('should capitalize last letter correctly', () => {
      const hint = hintSystem.generateHint('madrid', 3);
      expect(hint).toBe('The capital starts with "M" and ends with "D".');
    });

    it('should throw error for invalid hint level (too low)', () => {
      expect(() => hintSystem.generateHint('Paris', 0)).toThrow('Invalid hint level: 0');
    });

    it('should throw error for invalid hint level (too high)', () => {
      expect(() => hintSystem.generateHint('Paris', 4)).toThrow('Invalid hint level: 4');
    });
  });

  describe('getAvailableHintLevels', () => {
    it('should return all available hint levels', () => {
      const levels = hintSystem.getAvailableHintLevels();
      expect(levels).toHaveLength(3);
      expect(levels[0].level).toBe(1);
      expect(levels[0].description).toBe('Number of letters');
      expect(levels[1].level).toBe(2);
      expect(levels[1].description).toBe('First letter');
      expect(levels[2].level).toBe(3);
      expect(levels[2].description).toBe('First and last letters');
    });

    it('should return a copy of hint levels (not reference)', () => {
      const levels1 = hintSystem.getAvailableHintLevels();
      const levels2 = hintSystem.getAvailableHintLevels();
      expect(levels1).not.toBe(levels2);
      expect(levels1).toEqual(levels2);
    });
  });

  describe('getMaxHints', () => {
    it('should return the maximum number of hints', () => {
      expect(hintSystem.getMaxHints()).toBe(3);
    });
  });

  describe('generateHintsUpToLevel', () => {
    it('should generate hints up to level 1', () => {
      const hints = hintSystem.generateHintsUpToLevel('Paris', 1);
      expect(hints).toHaveLength(1);
      expect(hints[0]).toBe('The capital has 5 letters.');
    });

    it('should generate hints up to level 2', () => {
      const hints = hintSystem.generateHintsUpToLevel('London', 2);
      expect(hints).toHaveLength(2);
      expect(hints[0]).toBe('The capital has 6 letters.');
      expect(hints[1]).toBe('The capital starts with "L".');
    });

    it('should generate hints up to level 3', () => {
      const hints = hintSystem.generateHintsUpToLevel('Berlin', 3);
      expect(hints).toHaveLength(3);
      expect(hints[0]).toBe('The capital has 6 letters.');
      expect(hints[1]).toBe('The capital starts with "B".');
      expect(hints[2]).toBe('The capital starts with "B" and ends with "N".');
    });

    it('should cap at maximum available hints', () => {
      const hints = hintSystem.generateHintsUpToLevel('Tokyo', 5);
      expect(hints).toHaveLength(3);
    });

    it('should handle level 0 gracefully', () => {
      const hints = hintSystem.generateHintsUpToLevel('Paris', 0);
      expect(hints).toHaveLength(0);
    });
  });

  describe('getHintDescription', () => {
    it('should return correct description for level 1', () => {
      expect(hintSystem.getHintDescription(1)).toBe('Number of letters');
    });

    it('should return correct description for level 2', () => {
      expect(hintSystem.getHintDescription(2)).toBe('First letter');
    });

    it('should return correct description for level 3', () => {
      expect(hintSystem.getHintDescription(3)).toBe('First and last letters');
    });

    it('should throw error for invalid level', () => {
      expect(() => hintSystem.getHintDescription(0)).toThrow('Invalid hint level: 0');
      expect(() => hintSystem.getHintDescription(4)).toThrow('Invalid hint level: 4');
    });
  });

  describe('isValidHintLevel', () => {
    it('should return true for valid levels', () => {
      expect(hintSystem.isValidHintLevel(1)).toBe(true);
      expect(hintSystem.isValidHintLevel(2)).toBe(true);
      expect(hintSystem.isValidHintLevel(3)).toBe(true);
    });

    it('should return false for invalid levels', () => {
      expect(hintSystem.isValidHintLevel(0)).toBe(false);
      expect(hintSystem.isValidHintLevel(4)).toBe(false);
      expect(hintSystem.isValidHintLevel(-1)).toBe(false);
    });
  });
});