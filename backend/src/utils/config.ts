import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  neoRpcUrl: process.env.NEO_RPC_URL || 'https://mainnet1.neo.coz.io:443',
  neoNetwork: process.env.NEO_NETWORK || 'mainnet',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  cacheTimeout: parseInt(process.env.CACHE_TIMEOUT || '300', 10), // 5 minutes default
  
  // Well-known Neo token addresses (mainnet)
  tokens: {
    NEO: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
    GAS: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
  },
  
  // Clustering thresholds
  whaleThreshold: 0.01, // 1% of total supply
  minTransactionsForAnalysis: 10,
};
