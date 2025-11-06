import { Router, Request, Response } from 'express';
import { NeoService } from '../services/neoService';
import { DataProcessor } from '../services/dataProcessor';
import NodeCache from 'node-cache';

const router = Router();
const neoService = new NeoService();
const dataProcessor = new DataProcessor();

// Cache with 5 minute TTL
const cache = new NodeCache({ stdTTL: 300 });

// Get bubble map data for a token
router.get('/bubblemap/:contractHash', async (req: Request, res: Response) => {
  try {
    const { contractHash } = req.params;
    const { limit = '100', minBalance } = req.query;

    const cacheKey = `bubblemap-${contractHash}-${limit}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    // Fetch token info and holders
    const [tokenInfo, holders] = await Promise.all([
      neoService.getTokenInfo(contractHash),
      neoService.getTokenHolders(contractHash, parseInt(limit as string))
    ]);

    // Process data for bubble map
    let bubbleMapData = dataProcessor.processHoldersForBubbleMap(
      holders,
      tokenInfo,
      parseInt(limit as string)
    );

    // Apply min balance filter if specified
    if (minBalance) {
      bubbleMapData = dataProcessor.filterBubblesByMinBalance(
        bubbleMapData,
        parseFloat(minBalance as string)
      );
    }

    cache.set(cacheKey, bubbleMapData);
    res.json(bubbleMapData);
  } catch (error) {
    console.error('Error fetching bubble map data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch bubble map data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get token information
router.get('/token/:contractHash', async (req: Request, res: Response) => {
  try {
    const { contractHash } = req.params;
    const cacheKey = `token-${contractHash}`;
    
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const tokenInfo = await neoService.getTokenInfo(contractHash);
    cache.set(cacheKey, tokenInfo);
    
    res.json(tokenInfo);
  } catch (error) {
    console.error('Error fetching token info:', error);
    res.status(500).json({ 
      error: 'Failed to fetch token information',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get token holders
router.get('/holders/:contractHash', async (req: Request, res: Response) => {
  try {
    const { contractHash } = req.params;
    const { limit = '100' } = req.query;

    const cacheKey = `holders-${contractHash}-${limit}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const holders = await neoService.getTokenHolders(
      contractHash,
      parseInt(limit as string)
    );

    cache.set(cacheKey, holders);
    res.json(holders);
  } catch (error) {
    console.error('Error fetching holders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch token holders',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get cluster analysis
router.get('/analysis/:contractHash', async (req: Request, res: Response) => {
  try {
    const { contractHash } = req.params;
    const cacheKey = `analysis-${contractHash}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const [tokenInfo, holders] = await Promise.all([
      neoService.getTokenInfo(contractHash),
      neoService.getTokenHolders(contractHash, 500)
    ]);

    const distribution = dataProcessor.analyzeDistribution(holders);
    const clusterAnalysis = dataProcessor.getClusterAnalysis(holders);

    const result = {
      tokenInfo,
      distribution,
      clusters: clusterAnalysis,
      timestamp: Date.now()
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching cluster analysis:', error);
    res.status(500).json({ 
      error: 'Failed to fetch cluster analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get address details
router.get('/address/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { limit = '50' } = req.query;

    const cacheKey = `address-${address}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const transactions = await neoService.getTransactions(
      address,
      parseInt(limit as string)
    );

    const result = {
      address,
      transactions,
      transactionCount: transactions.length,
      timestamp: Date.now()
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching address details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch address details',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get blockchain status
router.get('/status', async (req: Request, res: Response) => {
  try {
    const blockHeight = await neoService.getBlockHeight();
    res.json({
      blockHeight,
      network: 'mainnet',
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching blockchain status:', error);
    res.status(500).json({ 
      error: 'Failed to fetch blockchain status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Clear cache endpoint (for development)
router.post('/cache/clear', (req: Request, res: Response) => {
  cache.flushAll();
  res.json({ message: 'Cache cleared successfully' });
});

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

export default router;
