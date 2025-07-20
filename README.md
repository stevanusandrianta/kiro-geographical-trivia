# 🌍 Capital City Guessing Game

An educational geography game built with TypeScript that helps you learn world capitals through an interactive guessing game with progressive hints.

## 🎮 Features

- **Smart Scoring System**: 3 points (no hints) → 2 points (1 hint) → 1 point (2+ hints) → 0 points (wrong)
- **Progressive Hints**: Letter count → First letter → First + last letters
- **Fuzzy Matching**: Accepts close spellings and alternative capital names
- **Achievement System**: Track streaks, milestones, and efficiency
- **Responsive Design**: Works on desktop and mobile devices
- **Educational**: Learn about 25+ countries from all continents

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

4. **Start playing!** 🎯

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:gh-pages` - Build for GitHub Pages deployment
- `npm run deploy` - Build and prepare for deployment
- `npm run preview` - Preview production build
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - Check TypeScript types

## 🚀 Deployment

This project is configured for automatic deployment to GitHub Pages.

### Automatic Deployment
- Push to `main` branch triggers automatic deployment
- GitHub Actions builds and deploys the project
- Live site updates within minutes

### Manual Deployment
```bash
npm run deploy
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🎯 How to Play

1. **Start the game** - Click "Start Playing!" to begin
2. **Guess the capital** - You'll see a country name and flag
3. **Enter your answer** - Type the capital city name
4. **Use hints if needed** - Get up to 3 progressive hints per question
5. **Track your progress** - See your score and efficiency in real-time
6. **Learn and improve** - Challenge yourself to get perfect scores!

## 🏗️ Project Structure

```
src/
├── data/
│   └── countries.ts          # Country data with capitals, flags, etc.
├── game/
│   ├── GameManager.ts        # Main game orchestrator
│   ├── QuestionManager.ts    # Question and hint management
│   ├── ScoreManager.ts       # Scoring and statistics
│   ├── AnswerValidator.ts    # Smart answer validation
│   ├── HintSystem.ts         # Progressive hint generation
│   ├── GameProgressTracker.ts # Progress and achievements
│   └── __tests__/           # Comprehensive test suite
├── types/
│   └── game.ts              # TypeScript interfaces
├── main.ts                  # Application entry point
└── style.css               # Game styling
```

## 🧪 Testing

The game includes a comprehensive test suite covering:

- **Unit Tests**: All game logic components
- **Integration Tests**: Complete game flow scenarios
- **Edge Cases**: Error handling and validation

Run tests with:
```bash
npm test
```

## 🎨 Customization

### Adding New Countries

Edit `src/data/countries.ts` to add more countries:

```typescript
{
  name: "Your Country",
  capital: "Capital City",
  continent: "Continent",
  subContinent: "Sub-continent",
  population: 1000000,
  mainLanguage: "Language",
  mainAirport: "Airport Name",
  currency: "Currency",
  area: 100000,
  flagEmoji: "🏳️"
}
```

### Modifying Scoring

Adjust scoring rules in `src/types/game.ts`:

```typescript
export const SCORING = {
  CORRECT_FIRST_TRY: 3,
  CORRECT_AFTER_ONE_HINT: 2,
  CORRECT_AFTER_MULTIPLE_HINTS: 1,
  INCORRECT_AFTER_ALL_HINTS: 0,
  MAX_HINTS: 3
} as const;
```

## 🛠️ Technology Stack

- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Jest** - Testing framework
- **ESLint** - Code quality and consistency
- **CSS3** - Modern styling with animations
- **HTML5** - Semantic markup

## 📊 Game Statistics

The game tracks comprehensive statistics including:

- Total score and efficiency percentage
- Questions answered and correct answers
- Perfect answers (no hints needed)
- Streak tracking (correct and perfect streaks)
- Performance trends over time
- Achievement notifications

## 🌟 Educational Value

This game helps players:

- **Learn Geography**: Discover capitals of countries worldwide
- **Improve Memory**: Reinforce learning through repetition
- **Build Confidence**: Progressive hints prevent frustration
- **Track Progress**: See improvement over time
- **Stay Motivated**: Achievement system encourages continued play

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

**Happy Learning! 🌍📚**