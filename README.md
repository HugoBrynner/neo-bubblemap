# Neo Bubblemap

A web application for visualizing token distributions and address clusters on the Neo blockchain, inspired by Bubblemaps.io.

## Features

- 🔍 **Token Distribution Visualization**: Interactive bubble map showing token holder distributions
- 🎯 **Address Clustering**: Automatic detection and categorization of whales, exchanges, contracts, and normal addresses
- 🔄 **Real-time Data**: Connects to Neo blockchain via RPC to fetch live token holder data
- 🎨 **Interactive UI**: Zoom, filter, and explore token distributions with D3.js visualizations
- 📊 **Rich Address Details**: View individual address balances, transaction history, and cluster information
- ⚡ **Performance**: Caching layer for fast data retrieval and optimized rendering

## Architecture

### Backend
- **Node.js + TypeScript + Express.js**: API server
- **@cityofzion/neon-js**: Neo blockchain integration
- **Node-cache**: In-memory caching for performance
- **RESTful API**: Clean endpoints for token data and address information

### Frontend
- **React + TypeScript**: Modern UI framework
- **D3.js**: Interactive bubble map visualization
- **Vite**: Fast development and optimized builds
- **Axios**: HTTP client for API communication

## Project Structure

```
neo-bubblemap/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controllers/    # API endpoint handlers
│   │   ├── services/       # Business logic (Neo service, clustering, data)
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Configuration and utilities
│   └── package.json
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components (BubbleMap, FilterPanel, etc.)
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript type definitions
│   │   └── styles/        # CSS styles
│   └── package.json
├── docker-compose.yml     # Docker orchestration
└── package.json           # Root package (workspace management)
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HugoBrynner/neo-bubblemap.git
cd neo-bubblemap
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

4. Configure your Neo RPC endpoint in `.env` files if needed.

### Development

Run both backend and frontend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Building

Build both backend and frontend for production:

```bash
npm run build
```

Or build separately:

```bash
npm run build:backend
npm run build:frontend
```

### Docker Deployment

Build and run with Docker Compose:

```bash
docker-compose up -d
```

The application will be available at http://localhost

To stop the containers:

```bash
docker-compose down
```

## API Endpoints

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/tokens
Get list of available tokens

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "NEO",
      "scriptHash": "0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5",
      "name": "NEO Token"
    }
  ]
}
```

### GET /api/bubblemap/:token
Get bubble map data for a specific token

**Parameters:**
- `token`: Token script hash
- `minBalance` (optional): Minimum balance filter
- `maxBalance` (optional): Maximum balance filter
- `cluster` (optional): Filter by cluster ID

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "NEO",
    "tokenName": "NEO Token",
    "totalSupply": "100000000",
    "holders": [...],
    "clusters": [...],
    "timestamp": 1234567890
  }
}
```

### GET /api/address/:address
Get details for a specific address

**Parameters:**
- `address`: Neo address
- `token`: Token script hash (query parameter)

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "NXXXxxxXXXxxxXXXxxxXXXxxxXXX",
    "balance": "1000",
    "transactions": [...],
    "timestamp": 1234567890
  }
}
```

### POST /api/cache/clear
Clear the cache

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

## Configuration

### Backend Configuration (backend/.env)

- `PORT`: Backend server port (default: 3001)
- `NEO_RPC_URL`: Neo blockchain RPC endpoint
- `NEO_NETWORK`: Network type (mainnet/testnet)
- `CORS_ORIGIN`: Allowed CORS origin
- `CACHE_TIMEOUT`: Cache timeout in seconds (default: 300)

### Frontend Configuration

The frontend proxies API requests to the backend during development via Vite's proxy configuration.

## Features in Detail

### Token Visualization
- Bubble size represents token holdings (larger = more tokens)
- Bubble color indicates cluster type:
  - 🔴 Red: Whales (>1% of supply)
  - 🟢 Teal: Exchanges
  - 🔵 Blue: Contracts
  - 🟡 Light Green: Normal addresses

### Clustering Algorithm
The application automatically clusters addresses based on:
- Percentage of total supply held
- Transaction patterns
- Address characteristics

### Filtering Options
- Filter by balance range
- Filter by cluster type
- Real-time visualization updates

### Performance Optimization
- Server-side caching reduces blockchain API calls
- Optimized D3.js rendering for large datasets
- Lazy loading for address details

## Development

### Linting

```bash
npm run lint
```

### Testing

```bash
npm run test
```

## Security & Privacy

- No private keys are stored or handled
- All blockchain data is public information
- Rate limiting recommended for production deployment
- Environment variables for sensitive configuration

## Scalability

The application is designed to scale:
- Stateless backend API (can be horizontally scaled)
- Caching layer reduces blockchain API load
- Modular architecture allows easy feature additions
- Docker support for cloud deployment

## Future Enhancements

- Support for additional NEP-17 tokens
- Transaction flow visualization
- Historical data analysis
- Advanced clustering algorithms
- Multi-chain support
- WebSocket for real-time updates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Acknowledgments

- Inspired by [Bubblemaps.io](https://bubblemaps.io)
- Built with [Neo blockchain](https://neo.org)
- Powered by [neon-js](https://github.com/CityOfZion/neon-js)
- Visualizations by [D3.js](https://d3js.org)