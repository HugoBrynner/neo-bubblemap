# Neo BubbleMap Architecture

This document describes the technical architecture of the Neo BubbleMap application.

## System Overview

Neo BubbleMap is a full-stack web application that visualizes token holder distributions on the Neo blockchain using interactive bubble maps. The system consists of three main components:

1. **Backend API** (Node.js + TypeScript + Express)
2. **Frontend Application** (React + TypeScript + D3.js)
3. **Infrastructure** (Docker + Nginx)

## Architecture Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP/HTTPS
       ▼
┌──────────────────┐
│  Frontend (React)│
│  + D3.js Viz     │
│  Port: 3000/80   │
└─────────┬────────┘
          │ REST API
          ▼
┌──────────────────┐      ┌─────────────────┐
│ Backend (Express)│◄────►│ Neo Blockchain  │
│  + Data Processor│      │  (RPC/API)      │
│  Port: 3001      │      └─────────────────┘
└──────────────────┘
          │
          ▼
┌──────────────────┐
│  Cache (Memory)  │
│  TTL: 5 minutes  │
└──────────────────┘
```

## Backend Architecture

### Core Components

#### 1. NeoService (`backend/src/services/neoService.ts`)

Handles all interactions with the Neo blockchain:

- **RPC Integration**: Connects to Neo N3 RPC endpoints
- **Token Information**: Fetches token symbol, name, decimals, total supply
- **Holder Data**: Retrieves token holder addresses and balances
- **Transaction History**: Fetches transaction data for addresses
- **Validation**: Validates contract hashes and addresses
- **Fallback**: Provides mock data when APIs are unavailable

**Key Methods:**
- `getTokenInfo(contractHash)`: Get token metadata
- `getTokenHolders(contractHash, limit)`: Get list of holders
- `getTransactions(address, limit)`: Get transaction history
- `getBlockHeight()`: Get current blockchain height

#### 2. DataProcessor (`backend/src/services/dataProcessor.ts`)

Processes raw blockchain data and performs analytics:

- **Clustering**: Groups addresses by holder type
  - Whales: >1% of total supply
  - Medium holders: 0.1-1% of supply
  - Retail: <0.1% of supply
  - Exchanges: Pattern matching
  - Dormant: No activity in 180+ days

- **Analytics**: Calculates distribution metrics
  - Gini coefficient
  - Top 10/50 concentration
  - Unique holder count

- **Filtering**: Applies filters to bubble data

**Key Methods:**
- `processHoldersForBubbleMap()`: Creates bubble map data structure
- `identifyClusters()`: Identifies and groups address clusters
- `analyzeDistribution()`: Calculates distribution metrics
- `getClusterAnalysis()`: Performs comprehensive cluster analysis

#### 3. API Routes (`backend/src/routes/api.ts`)

RESTful API endpoints with caching:

```typescript
GET  /api/bubblemap/:contractHash    # Bubble map data
GET  /api/token/:contractHash        # Token information
GET  /api/holders/:contractHash      # Holder list
GET  /api/analysis/:contractHash     # Cluster analysis
GET  /api/address/:address           # Address details
GET  /api/status                     # Blockchain status
GET  /api/health                     # Health check
POST /api/cache/clear                # Clear cache
```

**Caching Strategy:**
- In-memory cache with 5-minute TTL
- Cache keys include all query parameters
- Automatic cache invalidation

### Data Flow

```
1. HTTP Request → Express Router
2. Router → API Route Handler
3. Check Cache → Return if valid
4. NeoService → Fetch from blockchain
5. DataProcessor → Transform & analyze
6. Cache Result → Store with TTL
7. Response → JSON to client
```

## Frontend Architecture

### Component Structure

```
App (Root)
├── TokenSelector
├── FilterPanel
├── StatisticsPanel
└── BubbleMap (D3.js)
```

#### 1. App Component (`frontend/src/App.tsx`)

Main application container:
- State management for token selection and filters
- Orchestrates data fetching
- Manages component communication
- Handles error states

#### 2. TokenSelector Component

Token selection dropdown:
- Displays available tokens (NEO, GAS)
- Triggers data loading on selection
- Simple, accessible UI

#### 3. FilterPanel Component

Interactive filtering controls:
- Cluster checkboxes
- Reset filters button
- Shows cluster statistics

#### 4. StatisticsPanel Component

Displays analytics:
- Token information
- Distribution analysis
- Cluster breakdown
- Real-time updates

#### 5. BubbleMap Component (`frontend/src/components/BubbleMap.tsx`)

D3.js visualization:
- Force-directed graph layout
- Interactive bubbles (zoom, pan, hover)
- Dynamic sizing based on holdings
- Color coding by cluster type
- Tooltip with holder details

**D3.js Forces:**
- `forceManyBody`: Bubble repulsion
- `forceCenter`: Centering force
- `forceCollide`: Collision detection
- `forceX/Y`: Positioning forces

### State Management

Uses React hooks for state:
- `useState`: Component state
- `useEffect`: Side effects and data fetching
- `useRef`: D3.js integration

### Data Flow

```
1. User Action (select token)
2. API Service → Fetch data
3. State Update → Trigger re-render
4. Components → Update UI
5. D3.js → Update visualization
```

## Data Models

### TypeScript Interfaces

#### TokenInfo
```typescript
{
  symbol: string;        // e.g., "NEO"
  name: string;         // e.g., "NEO Token"
  contract: string;     // Contract hash
  totalSupply: number;  // Total token supply
  decimals: number;     // Token decimals
  holders: number;      // Number of holders
}
```

#### TokenHolder
```typescript
{
  address: string;      // Neo address
  balance: number;      // Token balance
  percentage: number;   // % of total supply
  lastActivity?: number; // Timestamp
  cluster?: string;     // Cluster ID
}
```

#### BubbleData
```typescript
{
  id: string;          // Unique bubble ID
  address: string;     // Holder address
  balance: number;     // Token balance
  percentage: number;  // % of supply
  cluster?: string;    // Cluster type
  clusterName?: string; // Human-readable name
  lastActivity?: number;
  label?: string;      // Display label
}
```

#### AddressCluster
```typescript
{
  id: string;          // Cluster ID
  name: string;        // Display name
  type: string;        // Cluster type
  addresses: string[]; // Member addresses
  totalBalance: number;
  percentage: number;
}
```

## Infrastructure

### Docker Setup

**Backend Container:**
- Base: Node.js 20 Alpine
- Port: 3001
- Environment: Production
- Health check: /api/health

**Frontend Container:**
- Build: Node.js 20 Alpine
- Runtime: Nginx Alpine
- Port: 80
- Serves static files
- Proxies /api to backend

**Docker Compose:**
- Network: Bridge network
- Volumes: None (stateless)
- Restart policy: unless-stopped

### Nginx Configuration

```nginx
location / {
    # Serve frontend static files
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
}

location /api {
    # Proxy to backend
    proxy_pass http://backend:3001;
}
```

## Security

### Input Validation

- Contract hash format: `0x[0-9a-fA-F]{40}`
- Neo address format: `N[base58]{33}`
- Numeric parameters: validated ranges

### XSS Prevention

- HTML escaping in tooltips
- Content Security Policy headers
- Safe rendering practices

### API Security

- CORS configuration
- Rate limiting ready
- Error message sanitization
- No sensitive data exposure

## Performance Optimization

### Backend
- Response caching (5-minute TTL)
- Connection pooling
- Efficient data structures
- Lazy loading

### Frontend
- Code splitting with Vite
- Lazy component loading
- Memoization of expensive calculations
- Optimized D3.js rendering
- Gzip compression

### Database
- In-memory cache (node-cache)
- No persistent storage needed
- Stateless architecture

## Scalability

### Horizontal Scaling
- Stateless backend instances
- Load balancer compatible
- Shared cache with Redis (optional)

### Vertical Scaling
- Configurable cache size
- Adjustable worker threads
- Resource limits in Docker

## Monitoring

### Health Checks
- `/api/health`: Application health
- `/api/status`: Blockchain status

### Logging
- Console logging with timestamps
- Request/response logging
- Error tracking

### Metrics
- Response times
- Cache hit rates
- API call counts

## Development Workflow

### Local Development
```bash
# Backend
cd backend
npm run dev  # ts-node-dev with hot reload

# Frontend
cd frontend
npm run dev  # Vite dev server
```

### Build Process
```bash
# Backend
npm run build  # TypeScript compilation

# Frontend
npm run build  # Vite production build
```

### CI/CD Pipeline
1. Checkout code
2. Install dependencies
3. Run linters
4. Build applications
5. Run tests
6. Build Docker images
7. Deploy (manual)

## Technology Stack

### Backend
- **Runtime**: Node.js 20
- **Language**: TypeScript 5.3
- **Framework**: Express 4.18
- **HTTP Client**: Axios 1.6
- **Cache**: node-cache 5.1

### Frontend
- **Framework**: React 18.2
- **Language**: TypeScript 5.2
- **Build Tool**: Vite 5.0
- **Visualization**: D3.js 7.8
- **HTTP Client**: Axios 1.6

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx
- **CI/CD**: GitHub Actions
- **Security Scan**: CodeQL

## Future Improvements

### Technical Debt
- Add unit tests
- Implement integration tests
- Add E2E tests with Playwright
- Performance profiling

### Features
- WebSocket for real-time updates
- Redis for distributed caching
- PostgreSQL for historical data
- GraphQL API option

### Infrastructure
- Kubernetes deployment
- Auto-scaling configuration
- CDN integration
- Multi-region deployment
