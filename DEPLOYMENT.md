# Deployment Guide

This project supports multiple free deployment options since GitHub Actions requires billing.

## Option 1: Manual GitHub Pages Deployment (Recommended)

### Quick Deploy
```bash
npm run deploy
```

This will build the project and deploy it to the `gh-pages` branch automatically.

### Manual Steps
1. **Build the project**:
   ```bash
   npm run build:gh-pages
   ```

2. **Run the deployment script**:
   ```bash
   ./deploy.sh
   ```

3. **Configure GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "Deploy from a branch"
   - Select `gh-pages` branch
   - Click Save

Your site will be live at: `https://[username].github.io/[repository-name]/`

## Option 2: Netlify (Free & Automatic)

### Setup Netlify Deployment
1. **Sign up at [netlify.com](https://netlify.com)** (free)

2. **Connect your GitHub repository**:
   - Click "New site from Git"
   - Choose GitHub and authorize
   - Select your repository

3. **Configure build settings**:
   - Build command: `npm run build:netlify`
   - Publish directory: `dist`
   - (These are already configured in `netlify.toml`)

4. **Deploy**: Netlify will automatically deploy on every push to main branch

Your site will be live at: `https://[random-name].netlify.app`

## Option 3: Vercel (Free & Automatic)

### Setup Vercel Deployment
1. **Sign up at [vercel.com](https://vercel.com)** (free)

2. **Import your repository**:
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Deploy**: Automatic deployment on every push

## Option 4: GitHub Codespaces + Manual Upload

If you prefer a completely manual approach:

1. **Build locally**:
   ```bash
   npm run build:netlify
   ```

2. **Upload `dist` folder** to any static hosting service:
   - GitHub Pages (manual upload)
   - Surge.sh
   - Firebase Hosting
   - Any web hosting provider

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

### Assets not loading on GitHub Pages
- Make sure you're using the `npm run build:gh-pages` command
- Check that your repository name matches the base path
- Ensure you're deploying to the `gh-pages` branch

### Build fails
```bash
npm test
npm run build
```

### Permission denied on deploy.sh
```bash
chmod +x deploy.sh
```

### Manual GitHub Pages setup
1. Repository Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `gh-pages`
4. Folder: `/ (root)`

## Recommended Approach

For the easiest setup with automatic deployments, use **Netlify**:
1. Free hosting
2. Automatic deployments
3. Custom domains
4. No billing required
5. Great performance

For GitHub Pages, use the **manual deployment script** which is simple and reliable.