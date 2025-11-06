# Neo BubbleMap

An interactive web application for visualizing token distributions and address clusters on the Neo blockchain, inspired by Bubblemaps.io.

## Features

- 🔍 **Token Distribution Visualization**: Interactive bubble maps showing token holder distributions
- 📊 **Address Clustering**: Automatic identification of whales, exchanges, contracts, and retail holders
- 📈 **Distribution Analysis**: Gini coefficient, concentration metrics, and statistical analysis
- 🎨 **Interactive UI**: Zoom, pan, filter, and explore token holders with D3.js visualizations
- 🔄 **Real-time Data**: Fetches live data from Neo blockchain via RPC and explorer APIs
- 🐳 **Docker Support**: Easy deployment with Docker and Docker Compose

## Architecture

### Backend (Node.js + TypeScript + Express)
- Neo blockchain integration via RPC and NeoScan API
- Data processing and clustering algorithms
- RESTful API endpoints for frontend consumption
- Caching layer for improved performance

### Frontend (React + TypeScript + D3.js)
- Interactive bubble map visualization
- Token selection and filtering
- Statistical dashboards
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ (for local development)
- Docker and Docker Compose (for containerized deployment)
- Neo blockchain RPC endpoint (defaults to public endpoints)

### Installation

#### Option 1: Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/HugoBrynner/neo-bubblemap.git
cd neo-bubblemap
```

2. Start the application:
```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3001

#### Option 2: Local Development

1. Clone the repository:
```bash
git clone https://github.com/HugoBrynner/neo-bubblemap.git
cd neo-bubblemap
```

2. Set up the backend:
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

3. Set up the frontend (in a new terminal):
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3001
NODE_ENV=development

# Neo Blockchain Configuration
NEO_RPC_URL=https://mainnet1.neo.coz.io:443
NEO_EXPLORER_API=https://api.neoscan.io/api/main_net/v1
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3001/api
```

## API Endpoints

### GET /api/bubblemap/:contractHash
Get bubble map data for a token
- **Query Parameters**: `limit` (number of holders), `minBalance` (minimum balance filter)

### GET /api/token/:contractHash
Get token information

### GET /api/holders/:contractHash
Get token holders list
- **Query Parameters**: `limit` (number of holders)

### GET /api/analysis/:contractHash
Get cluster analysis and distribution metrics

### GET /api/address/:address
Get address details and transaction history

### GET /api/status
Get blockchain status (current block height)

### GET /api/health
Health check endpoint

## Token Contract Addresses

### NEO N3 Mainnet

- **NEO**: `0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5`
- **GAS**: `0xd2a4cff31913016155e38e474a2c06d08be276cf`

## Project Structure

```
neo-bubblemap/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── services/       # Business logic and Neo integration
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   └── index.ts        # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/               # Frontend React app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml      # Docker orchestration
└── README.md              # This file
```

## Development

### Building

Backend:
```bash
cd backend
npm run build
```

Frontend:
```bash
cd frontend
npm run build
```

### Linting

Backend:
```bash
cd backend
npm run lint
```

Frontend:
```bash
cd frontend
npm run lint
```

## Clustering Algorithm

The application identifies several types of address clusters:

1. **Whales**: Addresses holding >1% of total supply
2. **Exchanges**: Addresses matching known exchange patterns
3. **Medium Holders**: Addresses holding 0.1% - 1% of supply
4. **Retail Holders**: Addresses holding <0.1% of supply
5. **Dormant Addresses**: Addresses with no activity for 180+ days

## Performance Considerations

- Data is cached for 5 minutes to reduce blockchain API calls
- Maximum of 100 holders displayed in bubble map by default
- Responsive design adapts to different screen sizes
- Efficient D3.js force simulation for smooth animations

## Security & Privacy

- No private keys or sensitive data stored
- All blockchain data is read-only
- CORS enabled for cross-origin requests
- Input validation on all API endpoints

## Future Enhancements

- [ ] Support for additional NEP-17 tokens
- [ ] Transaction flow visualization
- [ ] Historical holder analysis
- [ ] Export functionality (CSV, JSON)
- [ ] Advanced filtering options
- [ ] Mobile app version
- [ ] Support for other blockchains

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Inspired by [Bubblemaps.io](https://bubblemaps.io)
- Built with [Neo N3](https://neo.org)
- Powered by [D3.js](https://d3js.org) for visualizations

## Support

For issues and questions, please open an issue on GitHub.