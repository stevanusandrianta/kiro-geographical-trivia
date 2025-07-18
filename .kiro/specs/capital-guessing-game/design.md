# Design Document

## Overview

The Capital City Guessing Game is implemented as a TypeScript browser application with a clean separation between game logic, UI components, and data management. The design follows a modular architecture that makes the game extensible and maintainable while providing an engaging user experience.

## Architecture

The application follows a component-based architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   Game Engine   │    │   Data Layer    │
│                 │    │                 │    │                 │
│ - GameInterface │◄──►│ - GameState     │◄──►│ - CountryData   │
│ - ScoreDisplay  │    │ - HintSystem    │    │ - Validators    │
│ - HintDisplay   │    │ - ScoreManager  │    │ - Utils         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Components and Interfaces

### Core Interfaces

```typescript
interface GameState {
  currentCountry: Country | null;
  currentScore: number;
  hintsUsed: number;
  gameStatus: 'playing' | 'waiting' | 'ended';
  totalQuestions: number;
}

interface GameQuestion {
  country: Country;
  hintsAvailable: string[];
  hintsRevealed: string[];
  attempts: string[];
  isCompleted: boolean;
  pointsAwarded: number;
}

interface HintLevel {
  level: number;
  description: string;
  generator: (capital: string) => string;
}
```

### Game Engine Components

**GameManager**
- Manages overall game state and flow
- Handles question progression and game sessions
- Coordinates between UI and game logic
- Manages game start/end lifecycle

**HintSystem**
- Generates progressive hints based on capital city names
- Tracks hint usage per question
- Implements hint level progression (letters count → first letter → first+last letters)

**ScoreManager**
- Calculates points based on hints used
- Tracks cumulative score across questions
- Provides scoring rules and feedback

**AnswerValidator**
- Handles case-insensitive comparison
- Manages alternative capital names and common variations
- Implements fuzzy matching for close answers
- Provides feedback on near-miss attempts

### UI Components

**GameInterface**
- Main game container component
- Handles user input and displays current question
- Manages game controls (start, continue, end)
- Coordinates with game engine for state updates

**QuestionDisplay**
- Shows current country name and flag
- Displays input field for capital guess
- Handles form submission and validation feedback

**HintPanel**
- Displays available and revealed hints
- Provides hint request controls
- Shows hint progression visually

**ScoreBoard**
- Shows current score and question progress
- Displays points awarded for each question
- Provides game statistics and final summary

## Data Models

### Extended Country Interface
The existing Country interface from the data layer is used directly, with additional computed properties for game-specific needs:

```typescript
interface GameCountry extends Country {
  alternativeCapitalNames?: string[];
  difficultyLevel?: 'easy' | 'medium' | 'hard';
  commonMistakes?: string[];
}
```

### Game Session Data
```typescript
interface GameSession {
  sessionId: string;
  startTime: Date;
  questions: GameQuestion[];
  finalScore: number;
  totalPossibleScore: number;
  completedAt?: Date;
}
```

## Error Handling

### Input Validation
- Sanitize user input to prevent XSS
- Handle empty or invalid input gracefully
- Provide clear error messages for invalid states

### Game State Management
- Validate game state transitions
- Handle edge cases (no countries available, data loading failures)
- Implement fallback mechanisms for corrupted game state

### User Experience Errors
- Handle network connectivity issues gracefully
- Provide retry mechanisms for failed operations
- Maintain game progress during temporary errors

## Testing Strategy

### Unit Testing
- **Game Logic**: Test scoring algorithms, hint generation, answer validation
- **Data Utilities**: Test country data access functions and validators
- **State Management**: Test game state transitions and edge cases

### Integration Testing
- **Component Integration**: Test UI component interactions with game engine
- **Data Flow**: Test complete game flow from start to finish
- **User Scenarios**: Test common user paths and error scenarios

### User Acceptance Testing
- **Game Flow**: Verify complete game sessions work as expected
- **Hint System**: Validate hint progression and effectiveness
- **Scoring**: Confirm scoring matches requirements
- **Input Handling**: Test various input formats and edge cases

### Performance Testing
- **Response Time**: Ensure quick feedback on user actions
- **Memory Usage**: Monitor for memory leaks during extended play
- **Data Loading**: Test with large country datasets

## Implementation Approach

### Phase 1: Core Game Engine
- Implement basic game state management
- Create hint generation system
- Build answer validation logic
- Develop scoring mechanism

### Phase 2: User Interface
- Create main game interface components
- Implement question display and input handling
- Build hint panel and score display
- Add game flow controls

### Phase 3: Enhanced Features
- Add fuzzy matching for close answers
- Implement alternative capital name support
- Create game session persistence
- Add visual enhancements and animations

### Phase 4: Polish and Testing
- Comprehensive testing across all components
- Performance optimization
- Accessibility improvements
- Error handling refinement