# Requirements Document

## Introduction

The Capital City Guessing Game is an interactive educational feature that challenges users to identify the capital cities of various countries. When users make incorrect guesses, the system provides progressive hints to help them learn. This game aims to make geographical learning engaging and educational through a structured guessing mechanism with supportive feedback.

## Requirements

### Requirement 1

**User Story:** As a player, I want to be presented with a country name and guess its capital city, so that I can test and improve my geographical knowledge.

#### Acceptance Criteria

1. WHEN the game starts THEN the system SHALL display a random country name
2. WHEN the country is displayed THEN the system SHALL provide an input field for the user to enter their guess
3. WHEN the user submits a guess THEN the system SHALL validate the answer against the correct capital city
4. WHEN the guess is correct THEN the system SHALL display a success message and show the next country
5. WHEN the guess is incorrect THEN the system SHALL indicate the answer is wrong and offer hint options

### Requirement 2

**User Story:** As a player, I want to receive helpful hints when I guess incorrectly, so that I can learn the correct answer progressively.

#### Acceptance Criteria

1. WHEN the user makes an incorrect guess THEN the system SHALL offer to provide a hint
2. WHEN the user requests a hint THEN the system SHALL provide the number of letters in the capital city
3. WHEN the user requests a second hint THEN the system SHALL reveal the first letter of the capital city
4. WHEN the user requests a third hint THEN the system SHALL reveal the first and last letters of the capital city
5. WHEN the user has received all hints and still guesses incorrectly THEN the system SHALL reveal the correct answer

### Requirement 3

**User Story:** As a player, I want to see my game progress and score, so that I can track my performance and feel motivated to continue playing.

#### Acceptance Criteria

1. WHEN the game session starts THEN the system SHALL initialize a score counter at zero
2. WHEN the user answers correctly on the first try THEN the system SHALL award 3 points
3. WHEN the user answers correctly after 1 hint THEN the system SHALL award 2 points
4. WHEN the user answers correctly after 2-3 hints THEN the system SHALL award 1 point
5. WHEN the user cannot guess correctly after all hints THEN the system SHALL award 0 points
6. WHEN each question is completed THEN the system SHALL display the current total score

### Requirement 4

**User Story:** As a player, I want to control the game flow, so that I can play at my own pace and choose when to continue or stop.

#### Acceptance Criteria

1. WHEN a question is completed THEN the system SHALL provide options to continue to the next question or end the game
2. WHEN the user chooses to continue THEN the system SHALL present a new random country
3. WHEN the user chooses to end the game THEN the system SHALL display a final score summary
4. WHEN the game ends THEN the system SHALL provide an option to start a new game
5. WHEN starting a new game THEN the system SHALL reset the score to zero

### Requirement 5

**User Story:** As a player, I want the game to be case-insensitive and forgiving with my input, so that I don't lose points due to minor formatting differences.

#### Acceptance Criteria

1. WHEN comparing user input to the correct answer THEN the system SHALL ignore case differences
2. WHEN comparing user input to the correct answer THEN the system SHALL ignore leading and trailing whitespace
3. WHEN the user enters common alternative names for capitals THEN the system SHALL accept them as correct
4. WHEN the user makes minor spelling errors THEN the system SHOULD provide feedback suggesting the correct spelling
5. WHEN the input is very close to the correct answer THEN the system SHALL indicate the guess is close