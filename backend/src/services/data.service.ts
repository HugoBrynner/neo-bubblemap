import NodeCache from 'node-cache';
import { NeoService } from './neo.service';
import { ClusteringService } from './clustering.service';
import { BubbleMapData, FilterOptions } from '../types';
import { config } from '../utils/config';

export class DataService {
  private neoService: NeoService;
  private clusteringService: ClusteringService;
  private cache: NodeCache;

  constructor() {
    this.neoService = new NeoService();
    this.clusteringService = new ClusteringService();
    this.cache = new NodeCache({ stdTTL: config.cacheTimeout });
  }

  async getBubbleMapData(
    tokenScriptHash: string,
    options?: FilterOptions
  ): Promise<BubbleMapData> {
    const cacheKey = `bubblemap-${tokenScriptHash}-${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = this.cache.get<BubbleMapData>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Get token info
      const tokenInfo = await this.neoService.getTokenInfo(tokenScriptHash);

      // Get token holders
      const holders = await this.neoService.getTokenHolders(tokenScriptHash, 500);

      // Apply filters if provided
      let filteredHolders = holders;
      if (options) {
        filteredHolders = this.applyFilters(holders, options);
      }

      // Calculate total supply as number
      const totalSupply = parseFloat(tokenInfo.totalSupply);

      // Perform clustering analysis
      const clusters = this.clusteringService.analyzeHolders(
        filteredHolders,
        totalSupply
      );

      // Convert to token holders format
      const tokenHolders = this.clusteringService.toTokenHolders(
        filteredHolders,
        totalSupply
      );

      const bubbleMapData: BubbleMapData = {
        token: tokenInfo.symbol,
        tokenName: tokenInfo.name,
        totalSupply: tokenInfo.totalSupply,
        holders: tokenHolders,
        clusters,
        timestamp: Date.now(),
      };

      // Cache the result
      this.cache.set(cacheKey, bubbleMapData);

      return bubbleMapData;
    } catch (error) {
      console.error('Error generating bubble map data:', error);
      throw new Error('Failed to generate bubble map data');
    }
  }

  async getTokenList(): Promise<Array<{ symbol: string; scriptHash: string; name: string }>> {
    const cacheKey = 'token-list';
    
    const cached = this.cache.get<Array<{ symbol: string; scriptHash: string; name: string }>>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Get info for default tokens
      const tokens = await Promise.all([
        this.neoService.getTokenInfo(config.tokens.NEO),
        this.neoService.getTokenInfo(config.tokens.GAS),
      ]);

      const tokenList = tokens.map((token) => ({
        symbol: token.symbol,
        scriptHash: token.scriptHash,
        name: token.name,
      }));

      this.cache.set(cacheKey, tokenList);
      return tokenList;
    } catch (error) {
      console.error('Error getting token list:', error);
      throw new Error('Failed to get token list');
    }
  }

  async getAddressDetails(address: string, tokenScriptHash: string) {
    try {
      const [balance, transactions] = await Promise.all([
        this.neoService.getAddressBalance(address, tokenScriptHash),
        this.neoService.getTransactionHistory(address, 50),
      ]);

      return {
        address,
        balance,
        transactions,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error getting address details:', error);
      throw new Error('Failed to get address details');
    }
  }

  private applyFilters(holders: any[], options: FilterOptions): any[] {
    let filtered = holders;

    if (options.minBalance !== undefined) {
      filtered = filtered.filter((h) => h.balanceNumeric >= options.minBalance!);
    }

    if (options.maxBalance !== undefined) {
      filtered = filtered.filter((h) => h.balanceNumeric <= options.maxBalance!);
    }

    if (options.cluster) {
      filtered = filtered.filter((h) => h.cluster === options.cluster);
    }

    return filtered;
  }

  clearCache() {
    this.cache.flushAll();
  }
}
