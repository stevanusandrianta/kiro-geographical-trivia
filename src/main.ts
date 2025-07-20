import { GameManager } from './game/GameManager';
import './style.css';

// Global game instance
let gameManager: GameManager;

// Game state for UI
interface UIState {
  isPlaying: boolean;
  currentQuestion: any;
  progress: any;
  questionAnswered: boolean;
}

let uiState: UIState = {
  isPlaying: false,
  currentQuestion: null,
  progress: null,
  questionAnswered: false
};

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  gameManager = new GameManager();
  setupEventListeners();
});

function setupEventListeners() {
  // Answer input enter key
  const answerInput = document.getElementById('answer-input') as HTMLInputElement;
  if (answerInput) {
    answerInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        (window as any).submitAnswer();
      }
    });
  }
}

// Global functions for HTML onclick handlers
(window as any).startGame = function(category: string = 'country_to_capital') {
  try {
    // Set up timer update callback before starting the game
    gameManager.onTimerUpdate = (timeRemaining) => {
      updateElement('timer-display', timeRemaining.toString());
    };
    
    gameManager.startGame(category as any);
    uiState.isPlaying = true;
    
    showScreen('game-screen');
    updateGameDisplay();
    enableGameControls();
    focusAnswerInput();
  } catch (error) {
    console.error('Error starting game:', error);
    showFeedback('Error starting game. Please try again.', 'error');
  }
};

(window as any).submitAnswer = function() {
  if (!uiState.isPlaying || uiState.questionAnswered) return;
  
  const answerInput = document.getElementById('answer-input') as HTMLInputElement;
  const userInput = answerInput.value.trim();
  
  if (!userInput) {
    showFeedback('Please enter an answer!', 'error');
    return;
  }

  try {
    const result = gameManager.submitAnswer(userInput);
    
    if (result.isCorrect) {
      uiState.questionAnswered = true;
      showFeedback(`🎉 Correct! +${result.pointsAwarded} points`, 'success');
      showCountryTrivia();
      showAchievements();
      showNextButton();
      disableGameControls();
    } else if (result.isClose && result.suggestion) {
      showFeedback(`${result.message}`, 'close');
    } else {
      showFeedback(result.message, 'error');
    }
    
    updateGameDisplay();
  } catch (error) {
    console.error('Error submitting answer:', error);
    showFeedback('Error submitting answer. Please try again.', 'error');
  }
};

(window as any).requestHint = function() {
  if (!uiState.isPlaying || uiState.questionAnswered) return;
  
  try {
    const hint = gameManager.requestHint();
    
    if (hint) {
      updateHintsDisplay();
      updateGameDisplay();
    } else {
      showFeedback('No more hints available!', 'error');
    }
  } catch (error) {
    console.error('Error requesting hint:', error);
    showFeedback('Error getting hint. Please try again.', 'error');
  }
};

(window as any).skipQuestion = function() {
  if (!uiState.isPlaying || uiState.questionAnswered) return;
  
  try {
    const currentQuestion = gameManager.getCurrentQuestion();
    gameManager.skipQuestion();
    
    uiState.questionAnswered = true;
    showFeedback(`⏭️ Skipped. The answer was ${currentQuestion.correctAnswer}`, 'close');
    showCountryTrivia();
    showNextButton();
    disableGameControls();
    updateGameDisplay();
  } catch (error) {
    console.error('Error skipping question:', error);
    showFeedback('Error skipping question. Please try again.', 'error');
  }
};

(window as any).nextQuestion = function() {
  if (!uiState.isPlaying) return;
  
  try {
    gameManager.nextQuestion();
    
    uiState.questionAnswered = false;
    clearAnswerInput();
    clearFeedback();
    hideNextButton();
    enableGameControls();
    updateGameDisplay();
    focusAnswerInput();
  } catch (error) {
    console.error('Error loading next question:', error);
    showFeedback('Error loading next question. Please try again.', 'error');
  }
};

(window as any).endGame = function() {
  try {
    const session = gameManager.endGame();
    uiState.isPlaying = false;
    
    showGameOverScreen(session);
  } catch (error) {
    console.error('Error ending game:', error);
    showFeedback('Error ending game.', 'error');
  }
};

(window as any).startNewGame = function() {
  showScreen('start-screen');
  clearAllDisplays();
};

// Explore mode functions
(window as any).startExplore = function() {
  showScreen('explore-screen');
  displayCountries(countries);
  setActiveFilter('all');
};

(window as any).filterByContinent = function(continent: string) {
  setActiveFilter(continent);
  
  if (continent === 'all') {
    displayCountries(countries);
  } else {
    const filteredCountries = getCountriesByContinent(continent);
    displayCountries(filteredCountries);
  }
  
  // Clear search when filtering
  const searchInput = document.getElementById('country-search') as HTMLInputElement;
  if (searchInput) {
    searchInput.value = '';
  }
};

(window as any).searchCountries = function() {
  const searchInput = document.getElementById('country-search') as HTMLInputElement;
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (!searchTerm) {
    // If search is empty, show all countries or current filter
    const activeFilter = document.querySelector('.filter-btn.active')?.textContent;
    if (activeFilter?.includes('All')) {
      displayCountries(countries);
    } else {
      const continent = getActiveContinentFilter();
      if (continent) {
        const filteredCountries = getCountriesByContinent(continent);
        displayCountries(filteredCountries);
      }
    }
    return;
  }
  
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm) ||
    country.capital.toLowerCase().includes(searchTerm) ||
    country.continent.toLowerCase().includes(searchTerm) ||
    country.mainLanguage.toLowerCase().includes(searchTerm)
  );
  
  displayCountries(filteredCountries);
};

(window as any).showCountryDetail = function(countryName: string) {
  const country = countries.find(c => c.name === countryName);
  if (!country) return;
  
  const modal = document.getElementById('country-modal');
  const countryDetail = document.getElementById('country-detail');
  
  if (modal && countryDetail) {
    const formattedPopulation = country.population.toLocaleString();
    const formattedArea = country.area.toLocaleString();
    
    countryDetail.innerHTML = `
      <div class="country-detail-header">
        <div class="country-detail-flag">${country.flagEmoji}</div>
        <div class="country-detail-name">${country.name}</div>
        <div class="country-detail-capital">Capital: ${country.capital}</div>
      </div>
      
      <div class="country-detail-grid">
        <div class="trivia-item">
          <div class="trivia-label">Continent</div>
          <div class="trivia-value">${country.continent}</div>
        </div>
        <div class="trivia-item">
          <div class="trivia-label">Sub-continent</div>
          <div class="trivia-value">${country.subContinent}</div>
        </div>
        <div class="trivia-item">
          <div class="trivia-label">Population</div>
          <div class="trivia-value">${formattedPopulation}</div>
        </div>
        <div class="trivia-item">
          <div class="trivia-label">Main Language</div>
          <div class="trivia-value">${country.mainLanguage}</div>
        </div>
        <div class="trivia-item">
          <div class="trivia-label">Currency</div>
          <div class="trivia-value">${country.currency}</div>
        </div>
        <div class="trivia-item">
          <div class="trivia-label">Area</div>
          <div class="trivia-value">${formattedArea} km²</div>
        </div>
        <div class="trivia-item">
          <div class="trivia-label">Main Airport</div>
          <div class="trivia-value">${country.mainAirport}</div>
        </div>
      </div>
    `;
    
    modal.style.display = 'flex';
  }
};

(window as any).closeCountryModal = function() {
  const modal = document.getElementById('country-modal');
  if (modal) {
    modal.style.display = 'none';
  }
};

(window as any).backToHome = function() {
  showScreen('start-screen');
};

// Import countries data for explore mode
import { countries, getCountriesByContinent } from './data/countries';

// UI Helper Functions
function showScreen(screenId: string) {
  const screens = ['start-screen', 'game-screen', 'explore-screen', 'game-over-screen'];
  screens.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = id === screenId ? 'block' : 'none';
    }
  });
}

function updateGameDisplay() {
  try {
    const progress = gameManager.getProgress();
    const currentQuestion = gameManager.getCurrentQuestion();
    
    uiState.progress = progress;
    uiState.currentQuestion = currentQuestion;
    
    // Update score display
    updateElement('current-score', progress.currentScore.toString());
    updateElement('questions-answered', progress.questionsAnswered.toString());
    updateElement('score-percentage', `${Math.round(progress.scorePercentage)}%`);
    
    // Update timer display
    updateElement('timer-display', gameManager.getTimeRemaining().toString());
    
    // Update question display based on category
    if (currentQuestion.country) {
      const questionTextElement = document.querySelector('.question-text') as HTMLElement;
      if (questionTextElement && currentQuestion.questionText) {
        questionTextElement.textContent = currentQuestion.questionText;
      }
      
      // Update display based on quiz category
      if (currentQuestion.category === 'flag_to_country') {
        updateElement('country-flag', currentQuestion.country.flagEmoji);
        updateElement('country-name', ''); // Hide country name for flag quiz
      } else if (currentQuestion.category === 'capital_to_country') {
        updateElement('country-flag', '🏛️'); // Generic capital icon
        updateElement('country-name', currentQuestion.country.capital);
      } else {
        // Default: country_to_capital
        updateElement('country-flag', currentQuestion.country.flagEmoji);
        updateElement('country-name', currentQuestion.country.name);
      }
    }
    
    // Update hint button
    const hintsRemaining = currentQuestion.hintsRemaining;
    const hintBtn = document.getElementById('hint-btn') as HTMLButtonElement;
    if (hintBtn) {
      hintBtn.textContent = `Get Hint (${hintsRemaining} left)`;
      hintBtn.disabled = hintsRemaining === 0;
    }
    
    updateHintsDisplay();
  } catch (error) {
    console.error('Error updating game display:', error);
  }
}

function updateHintsDisplay() {
  const currentQuestion = gameManager.getCurrentQuestion();
  const hintsSection = document.getElementById('hints-section');
  const hintsList = document.getElementById('hints-list');
  
  if (hintsSection && hintsList) {
    if (currentQuestion.hintsRevealed.length > 0) {
      hintsSection.style.display = 'block';
      hintsList.innerHTML = currentQuestion.hintsRevealed
        .map(hint => `<div class="hint-item">• ${hint}</div>`)
        .join('');
    } else {
      hintsSection.style.display = 'none';
    }
  }
}

function showCountryTrivia() {
  try {
    const currentQuestion = gameManager.getCurrentQuestion();
    const triviaSection = document.getElementById('trivia-section');
    const triviaContent = document.getElementById('trivia-content');
    
    if (triviaSection && triviaContent && currentQuestion.country) {
      const country = currentQuestion.country;
      
      // Format population with commas
      const formattedPopulation = country.population.toLocaleString();
      
      // Format area with commas
      const formattedArea = country.area.toLocaleString();
      
      triviaSection.style.display = 'block';
      triviaContent.innerHTML = `
        <div class="trivia-item">
          <div class="trivia-flag">${country.flagEmoji}</div>
          <div class="trivia-label">Capital</div>
          <div class="trivia-value">${country.capital}</div>
        </div>
        <div class="trivia-item">
          <div class="trivia-label">Continent</div>
          <div class="trivia-value">${country.continent}</div>
        </div>
        <div class="trivia-item">
          <div class="trivia-label">Sub-continent</div>
          <div class="trivia-value">${country.subContinent}</div>
        </div>
        <div class="trivia-item">
          <div class="trivia-label">Population</div>
          <div class="trivia-value">${formattedPopulation}</div>
        </div>
        <div class="trivia-item">
          <div class="trivia-label">Main Language</div>
          <div class="trivia-value">${country.mainLanguage}</div>
        </div>
        <div class="trivia-item">
          <div class="trivia-label">Currency</div>
          <div class="trivia-value">${country.currency}</div>
        </div>
        <div class="trivia-item">
          <div class="trivia-label">Area</div>
          <div class="trivia-value">${formattedArea} km²</div>
        </div>
        <div class="trivia-item">
          <div class="trivia-label">Main Airport</div>
          <div class="trivia-value">${country.mainAirport}</div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error showing country trivia:', error);
  }
}

function showAchievements() {
  try {
    const achievements = gameManager.getAchievementNotifications();
    const achievementsSection = document.getElementById('achievements-section');
    
    if (achievementsSection && achievements.length > 0) {
      achievementsSection.style.display = 'block';
      achievementsSection.innerHTML = achievements
        .map(achievement => `<div class="achievement-item">${achievement}</div>`)
        .join('');
      
      // Hide achievements after 5 seconds
      setTimeout(() => {
        achievementsSection.style.display = 'none';
      }, 5000);
    }
  } catch (error) {
    console.error('Error showing achievements:', error);
  }
}

function showFeedback(message: string, type: 'success' | 'error' | 'close') {
  const feedbackSection = document.getElementById('feedback-section');
  if (feedbackSection) {
    feedbackSection.innerHTML = `<div class="feedback-message feedback-${type}">${message}</div>`;
  }
}

function clearFeedback() {
  const feedbackSection = document.getElementById('feedback-section');
  if (feedbackSection) {
    feedbackSection.innerHTML = '';
  }
  
  const hintsSection = document.getElementById('hints-section');
  if (hintsSection) {
    hintsSection.style.display = 'none';
  }
  
  const triviaSection = document.getElementById('trivia-section');
  if (triviaSection) {
    triviaSection.style.display = 'none';
  }
  
  const achievementsSection = document.getElementById('achievements-section');
  if (achievementsSection) {
    achievementsSection.style.display = 'none';
  }
}

function showNextButton() {
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.style.display = 'inline-block';
  }
}

function hideNextButton() {
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.style.display = 'none';
  }
}

function clearAnswerInput() {
  const answerInput = document.getElementById('answer-input') as HTMLInputElement;
  if (answerInput) {
    answerInput.value = '';
  }
}

function focusAnswerInput() {
  const answerInput = document.getElementById('answer-input') as HTMLInputElement;
  if (answerInput) {
    answerInput.focus();
  }
}

function showGameOverScreen(session: any) {
  showScreen('game-over-screen');
  
  const percentage = session.totalPossibleScore > 0 
    ? Math.round((session.finalScore / session.totalPossibleScore) * 100) 
    : 0;
  
  updateElement('final-score', `Final Score: ${session.finalScore}/${session.totalPossibleScore} (${percentage}%)`);
  
  const summaryElement = document.getElementById('game-summary');
  if (summaryElement) {
    summaryElement.innerHTML = `
      <p>Questions Answered: ${session.questions.length}</p>
      <p>Score Efficiency: ${percentage}%</p>
      <p>Great job learning about world capitals! 🌍</p>
    `;
  }
}

function clearAllDisplays() {
  clearFeedback();
  clearAnswerInput();
  hideNextButton();
}

function updateElement(id: string, content: string) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = content;
  }
}

function enableGameControls() {
  const submitBtn = document.querySelector('.btn-primary') as HTMLButtonElement;
  const hintBtn = document.getElementById('hint-btn') as HTMLButtonElement;
  const skipBtn = document.querySelector('.btn-secondary') as HTMLButtonElement;
  const answerInput = document.getElementById('answer-input') as HTMLInputElement;
  
  if (submitBtn) submitBtn.disabled = false;
  if (hintBtn) hintBtn.disabled = false;
  if (skipBtn) skipBtn.disabled = false;
  if (answerInput) answerInput.disabled = false;
}

function disableGameControls() {
  const submitBtn = document.querySelector('.btn-primary') as HTMLButtonElement;
  const hintBtn = document.getElementById('hint-btn') as HTMLButtonElement;
  const skipBtn = document.querySelector('.btn-secondary') as HTMLButtonElement;
  const answerInput = document.getElementById('answer-input') as HTMLInputElement;
  
  if (submitBtn) submitBtn.disabled = true;
  if (hintBtn) hintBtn.disabled = true;
  if (skipBtn) skipBtn.disabled = true;
  if (answerInput) answerInput.disabled = true;
}

// Explore mode helper functions
function displayCountries(countriesToShow: any[]) {
  const grid = document.getElementById('countries-grid');
  if (!grid) return;
  
  grid.innerHTML = countriesToShow.map(country => `
    <div class="country-card" onclick="showCountryDetail('${country.name}')">
      <div class="country-card-flag">${country.flagEmoji}</div>
      <div class="country-card-name">${country.name}</div>
      <div class="country-card-capital">Capital: ${country.capital}</div>
      <div class="country-card-info">
        ${country.continent} • ${country.population.toLocaleString()} people
      </div>
    </div>
  `).join('');
}

function setActiveFilter(filterType: string) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.classList.remove('active');
    if (filterType === 'all' && btn.textContent?.includes('All')) {
      btn.classList.add('active');
    } else if (btn.textContent?.includes(filterType)) {
      btn.classList.add('active');
    }
  });
}

function getActiveContinentFilter(): string | null {
  const activeBtn = document.querySelector('.filter-btn.active');
  if (!activeBtn || activeBtn.textContent?.includes('All')) {
    return null;
  }
  
  const text = activeBtn.textContent || '';
  if (text.includes('Europe')) return 'Europe';
  if (text.includes('Asia')) return 'Asia';
  if (text.includes('Africa')) return 'Africa';
  if (text.includes('N. America')) return 'North America';
  if (text.includes('S. America')) return 'South America';
  if (text.includes('Oceania')) return 'Oceania';
  
  return null;
}



// Export for potential external use
export { gameManager };