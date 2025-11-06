# Quick Start Guide

Get Neo Bubblemap up and running in minutes!

## Prerequisites

- Node.js 18+ and npm 9+
- Git

## Step 1: Clone the Repository

```bash
git clone https://github.com/HugoBrynner/neo-bubblemap.git
cd neo-bubblemap
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install dependencies for both backend and frontend workspaces.

## Step 3: Configure Environment

```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env

# (Optional) Edit .env files if you need to customize settings
```

Default configuration works out of the box for development!

## Step 4: Start the Application

```bash
npm run dev
```

This starts both backend and frontend in development mode.

## Step 5: Open in Browser

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/health

## What You'll See

1. **Token Selector**: Choose between NEO and GAS tokens
2. **Interactive Bubble Map**: Each bubble represents a token holder
   - Size = holdings
   - Color = cluster type (whale, exchange, contract, normal)
3. **Filter Panel**: Filter by balance range or cluster type
4. **Address Details**: Click any bubble to view detailed information

## Exploring the Application

### View Token Distribution
1. Select a token from the dropdown (NEO or GAS)
2. The bubble map will load showing all token holders
3. Larger bubbles = larger holdings

### Filter Data
1. Use the sidebar to filter by:
   - Minimum balance
   - Maximum balance
   - Cluster type
2. Click "Apply" to see filtered results

### View Address Details
1. Click on any bubble in the visualization
2. A modal will show:
   - Full address
   - Token balance
   - Percentage of total supply
   - Recent transactions

### Zoom and Pan
- Scroll to zoom in/out
- Click and drag to pan around the visualization

## Troubleshooting

### Port Already in Use

If port 3000 or 3001 is already in use:

```bash
# Edit the port in backend/.env
PORT=3002

# Edit vite.config.ts in frontend/
# Change server.port to your preferred port
```

### Network Errors

If you see "Failed to fetch tokens":
- This is expected if Neo RPC endpoints are unreachable
- The application structure is complete and will work when deployed with proper network access
- For development, ensure you're not behind a strict firewall

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules backend/node_modules frontend/node_modules

# Reinstall
npm install
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute to the project

## Docker Quick Start

Prefer Docker? Even easier:

```bash
# Start with Docker Compose
docker-compose up -d

# Access the application
open http://localhost
```

## Development Tips

### Running Backend Only
```bash
npm run dev:backend
```

### Running Frontend Only
```bash
npm run dev:frontend
```

### Building for Production
```bash
npm run build
```

### Linting Code
```bash
npm run lint
```

## API Endpoints

Once running, you can test these endpoints:

```bash
# Health check
curl http://localhost:3001/api/health

# Get available tokens
curl http://localhost:3001/api/tokens

# Get bubble map data (replace with valid script hash)
curl http://localhost:3001/api/bubblemap/0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5

# Get address details (replace with valid address and token)
curl "http://localhost:3001/api/address/YOUR_ADDRESS?token=SCRIPT_HASH"
```

## Need Help?

- Open an issue on GitHub
- Check existing issues for solutions
- Read the detailed documentation

Happy exploring! 🚀
