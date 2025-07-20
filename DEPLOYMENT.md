# Deployment Guide

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

## Automatic Deployment

The project will automatically deploy to GitHub Pages when you push to the `main` branch. The GitHub Actions workflow will:

1. Install dependencies
2. Run tests
3. Build the project
4. Deploy to GitHub Pages

## Manual Deployment

If you need to deploy manually:

```bash
# Build for production
npm run build:gh-pages

# The built files will be in the `dist` folder
```

## Configuration

### Repository Name
If your repository name is different from `capital-guessing-game`, update the base path in `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === 'production' 
  ? '/your-repo-name/' 
  : '/',
```

Or set the `VITE_BASE_PATH` environment variable:

```bash
VITE_BASE_PATH=/your-repo-name/ npm run build:gh-pages
```

### GitHub Pages Settings

Make sure your GitHub repository is configured for GitHub Pages:

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"
4. The workflow will handle the deployment automatically

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Troubleshooting

### Assets not loading
If CSS/JS files aren't loading on GitHub Pages, check that the base path in `vite.config.ts` matches your repository name.

### Build fails
Make sure all tests pass locally before pushing:
```bash
npm test
npm run build
```

### GitHub Actions permissions
The workflow needs the following permissions (already configured):
- `contents: read`
- `pages: write` 
- `id-token: write`