import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Neo BubbleMap API',
    version: '1.0.0',
    endpoints: {
      bubblemap: '/api/bubblemap/:contractHash',
      token: '/api/token/:contractHash',
      holders: '/api/holders/:contractHash',
      analysis: '/api/analysis/:contractHash',
      address: '/api/address/:address',
      status: '/api/status',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Neo BubbleMap API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Neo RPC URL: ${process.env.NEO_RPC_URL || 'https://mainnet1.neo.coz.io:443'}`);
});

export default app;
