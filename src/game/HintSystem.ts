import { HintLevel } from '../types/game';

export class HintSystem {
    private hintLevels: HintLevel[] = [
        {
            level: 1,
            description: 'Number of letters',
            generator: (capital: string) => `The capital has ${capital.length} letters.`
        },
        {
            level: 2,
            description: 'First letter',
            generator: (capital: string) => `The capital starts with "${capital.charAt(0).toUpperCase()}".`
        },
        {
            level: 3,
            description: 'First and last letters',
            generator: (capital: string) => {
                const first = capital.charAt(0).toUpperCase();
                const last = capital.charAt(capital.length - 1).toUpperCase();
                return `The capital starts with "${first}" and ends with "${last}".`;
            }
        }
    ];

    /**
     * Generates a hint for the given level
     */
    public generateHint(capital: string, level: number): string {
        if (level < 1 || level > this.hintLevels.length) {
            throw new Error(`Invalid hint level: ${level}. Must be between 1 and ${this.hintLevels.length}.`);
        }

        const hintLevel = this.hintLevels[level - 1];
        return hintLevel.generator(capital);
    }

    /**
     * Gets all available hint levels
     */
    public getAvailableHintLevels(): HintLevel[] {
        return [...this.hintLevels];
    }

    /**
     * Gets the maximum number of hints available
     */
    public getMaxHints(): number {
        return this.hintLevels.length;
    }

    /**
     * Generates all hints for a capital up to the specified level
     */
    public generateHintsUpToLevel(capital: string, maxLevel: number): string[] {
        const hints: string[] = [];
        const actualMaxLevel = Math.min(maxLevel, this.hintLevels.length);

        for (let level = 1; level <= actualMaxLevel; level++) {
            hints.push(this.generateHint(capital, level));
        }

        return hints;
    }

    /**
     * Gets the description for a specific hint level
     */
    public getHintDescription(level: number): string {
        if (level < 1 || level > this.hintLevels.length) {
            throw new Error(`Invalid hint level: ${level}`);
        }

        return this.hintLevels[level - 1].description;
    }

    /**
     * Checks if a hint level is valid
     */
    public isValidHintLevel(level: number): boolean {
        return level >= 1 && level <= this.hintLevels.length;
    }
}