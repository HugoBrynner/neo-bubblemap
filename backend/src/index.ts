import express from 'express';
import cors from 'cors';
import { config } from './utils/config';
import { ApiController } from './controllers/api.controller';

const app = express();
const apiController = new ApiController();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/api/health', (req, res) => apiController.healthCheck(req, res));
app.get('/api/tokens', (req, res) => apiController.getTokens(req, res));
app.get('/api/bubblemap/:token', (req, res) => apiController.getBubbleMap(req, res));
app.get('/api/address/:address', (req, res) => apiController.getAddressDetails(req, res));
app.post('/api/cache/clear', (req, res) => apiController.clearCache(req, res));

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Neo Bubblemap API server running on port ${config.port}`);
  console.log(`📡 Neo RPC: ${config.neoRpcUrl}`);
  console.log(`🌐 CORS origin: ${config.corsOrigin}`);
});

export default app;
