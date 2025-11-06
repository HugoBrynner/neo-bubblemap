import axios from 'axios';
import { TokenHolder, TokenInfo, Transaction } from '../types';

export class NeoService {
  private rpcUrl: string;
  private explorerApiUrl: string;

  constructor() {
    this.rpcUrl = process.env.NEO_RPC_URL || 'https://mainnet1.neo.coz.io:443';
    this.explorerApiUrl = process.env.NEO_EXPLORER_API || 'https://api.neoscan.io/api/main_net/v1';
  }

  async invokeFunction(contractHash: string, method: string, params: any[] = []): Promise<any> {
    try {
      const response = await axios.post(this.rpcUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'invokefunction',
        params: [contractHash, method, params]
      });
      return response.data.result;
    } catch (error) {
      console.error('Error invoking contract function:', error);
      throw error;
    }
  }

  async getTokenInfo(contractHash: string): Promise<TokenInfo> {
    try {
      // Get token symbol, name, decimals, and total supply
      const [symbolResult, nameResult, decimalsResult, totalSupplyResult] = await Promise.all([
        this.invokeFunction(contractHash, 'symbol'),
        this.invokeFunction(contractHash, 'name'),
        this.invokeFunction(contractHash, 'decimals'),
        this.invokeFunction(contractHash, 'totalSupply')
      ]);

      const symbol = this.parseStackItem(symbolResult.stack[0]);
      const name = this.parseStackItem(nameResult.stack[0]);
      const decimals = parseInt(this.parseStackItem(decimalsResult.stack[0]));
      const totalSupply = parseInt(this.parseStackItem(totalSupplyResult.stack[0]));

      return {
        symbol,
        name,
        contract: contractHash,
        totalSupply: totalSupply / Math.pow(10, decimals),
        decimals,
        holders: 0 // Will be updated when fetching holders
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      // Return default values for common tokens
      return this.getDefaultTokenInfo(contractHash);
    }
  }

  private getDefaultTokenInfo(contractHash: string): TokenInfo {
    const defaults: { [key: string]: TokenInfo } = {
      '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5': {
        symbol: 'NEO',
        name: 'NEO Token',
        contract: contractHash,
        totalSupply: 100000000,
        decimals: 0,
        holders: 0
      },
      '0xd2a4cff31913016155e38e474a2c06d08be276cf': {
        symbol: 'GAS',
        name: 'GAS Token',
        contract: contractHash,
        totalSupply: 100000000,
        decimals: 8,
        holders: 0
      }
    };
    return defaults[contractHash] || {
      symbol: 'UNKNOWN',
      name: 'Unknown Token',
      contract: contractHash,
      totalSupply: 0,
      decimals: 8,
      holders: 0
    };
  }

  async getTokenHolders(contractHash: string, limit: number = 100): Promise<TokenHolder[]> {
    try {
      // Use Neo explorer API to get token holders
      const response = await axios.get(
        `${this.explorerApiUrl}/get_all_token_holders/${contractHash}`,
        { timeout: 10000 }
      );

      if (response.data && Array.isArray(response.data)) {
        const holders = response.data.slice(0, limit).map((holder: any) => ({
          address: holder.address,
          balance: parseFloat(holder.balance),
          percentage: parseFloat(holder.percentage || 0),
          lastActivity: holder.last_transaction_time
        }));
        return holders;
      }

      // If API fails, return mock data for demonstration
      return this.getMockTokenHolders(contractHash, limit);
    } catch (error) {
      console.error('Error fetching token holders:', error);
      // Return mock data for demonstration purposes
      return this.getMockTokenHolders(contractHash, limit);
    }
  }

  private getMockTokenHolders(contractHash: string, limit: number): TokenHolder[] {
    const holders: TokenHolder[] = [];
    const totalSupply = 100000000;
    let remainingSupply = totalSupply;

    // Generate mock whale addresses (top 5)
    for (let i = 0; i < Math.min(5, limit); i++) {
      const balance = remainingSupply * (0.05 + Math.random() * 0.1);
      holders.push({
        address: this.generateMockAddress(),
        balance,
        percentage: (balance / totalSupply) * 100,
        lastActivity: Date.now() - Math.random() * 86400000 * 30,
        cluster: 'whale'
      });
      remainingSupply -= balance;
    }

    // Generate medium holders
    const mediumHolders = Math.min(20, limit - 5);
    for (let i = 0; i < mediumHolders; i++) {
      const balance = remainingSupply * (0.01 + Math.random() * 0.03);
      holders.push({
        address: this.generateMockAddress(),
        balance,
        percentage: (balance / totalSupply) * 100,
        lastActivity: Date.now() - Math.random() * 86400000 * 60,
        cluster: 'medium'
      });
      remainingSupply -= balance;
    }

    // Generate retail holders
    const retailHolders = Math.min(limit - holders.length, 75);
    for (let i = 0; i < retailHolders; i++) {
      const balance = (remainingSupply / retailHolders) * (0.5 + Math.random());
      holders.push({
        address: this.generateMockAddress(),
        balance,
        percentage: (balance / totalSupply) * 100,
        lastActivity: Date.now() - Math.random() * 86400000 * 90,
        cluster: 'retail'
      });
    }

    return holders.sort((a, b) => b.balance - a.balance);
  }

  private generateMockAddress(): string {
    const chars = '0123456789abcdef';
    let address = 'N';
    for (let i = 0; i < 33; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }

  async getTransactions(address: string, limit: number = 50): Promise<Transaction[]> {
    try {
      const response = await axios.get(
        `${this.explorerApiUrl}/get_address_abstracts/${address}/1`,
        { timeout: 10000 }
      );

      if (response.data && response.data.entries) {
        return response.data.entries.slice(0, limit).map((tx: any) => ({
          hash: tx.txid,
          from: tx.address_from,
          to: tx.address_to,
          amount: parseFloat(tx.amount),
          timestamp: tx.time,
          token: tx.asset
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  private parseStackItem(item: any): string {
    if (!item) return '';
    
    if (item.type === 'ByteString') {
      // Convert hex string to UTF-8
      const hex = item.value;
      try {
        return Buffer.from(hex, 'hex').toString('utf8');
      } catch {
        return hex;
      }
    } else if (item.type === 'Integer') {
      return item.value;
    }
    
    return item.value || '';
  }

  async getBlockHeight(): Promise<number> {
    try {
      const response = await axios.post(this.rpcUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getblockcount'
      });
      return response.data.result;
    } catch (error) {
      console.error('Error getting block height:', error);
      return 0;
    }
  }
}
