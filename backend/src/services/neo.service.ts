import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Neon = require('@cityofzion/neon-js');
import { config } from '../utils/config';
import { AddressData, TokenInfo, TransactionFlow } from '../types';

export class NeoService {
  private rpcClient: any; // Using any to avoid type issues with neon-js
  private dora: string; // Dora API for additional data

  constructor() {
    this.rpcClient = new Neon.rpc.RPCClient(config.neoRpcUrl);
    this.dora = 'https://dora.coz.io/api/v2/neo3/mainnet';
  }

  async getBlockHeight(): Promise<number> {
    try {
      const height = await this.rpcClient.getBlockCount();
      return height - 1;
    } catch (error) {
      console.error('Error getting block height:', error);
      throw new Error('Failed to get block height');
    }
  }

  async getTokenInfo(scriptHash: string): Promise<TokenInfo> {
    try {
      // Validate scriptHash to prevent injection attacks
      if (!this.isValidScriptHash(scriptHash)) {
        throw new Error('Invalid script hash format');
      }

      const [symbol, name, decimals, totalSupply] = await Promise.all([
        this.invokeFunction(scriptHash, 'symbol', []),
        this.invokeFunction(scriptHash, 'name', []),
        this.invokeFunction(scriptHash, 'decimals', []),
        this.invokeFunction(scriptHash, 'totalSupply', []),
      ]);

      return {
        symbol: this.parseStackItem(symbol),
        name: this.parseStackItem(name),
        decimals: parseInt(this.parseStackItem(decimals)),
        totalSupply: this.parseStackItem(totalSupply),
        scriptHash,
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      throw new Error('Failed to get token information');
    }
  }

  async getTokenHolders(scriptHash: string, limit: number = 100): Promise<AddressData[]> {
    try {
      // Validate scriptHash to prevent request forgery
      if (!this.isValidScriptHash(scriptHash)) {
        throw new Error('Invalid script hash format');
      }

      // Use Dora API to get token holders
      const response = await axios.get(
        `${this.dora}/nep17/${encodeURIComponent(scriptHash)}/holders`,
        {
          params: { limit, page: 1 },
          timeout: 30000,
        }
      );

      if (response.data && response.data.items) {
        return response.data.items.map((item: any) => ({
          address: item.address,
          balance: item.balance,
          balanceNumeric: parseFloat(item.balance),
          lastActivityBlock: item.last_transaction_time,
        }));
      }

      return [];
    } catch (error) {
      console.error('Error getting token holders:', error);
      // Fallback to empty array if Dora API fails
      return this.getTokenHoldersFallback(scriptHash, limit);
    }
  }

  private async getTokenHoldersFallback(scriptHash: string, limit: number): Promise<AddressData[]> {
    // This is a simplified fallback that returns mock data for demonstration
    // In production, you'd implement actual blockchain scanning
    console.warn('Using fallback token holders data');
    return [];
  }

  async getAddressBalance(address: string, scriptHash: string): Promise<string> {
    try {
      // Validate inputs
      if (!this.isValidNeoAddress(address)) {
        throw new Error('Invalid Neo address format');
      }
      if (!this.isValidScriptHash(scriptHash)) {
        throw new Error('Invalid script hash format');
      }

      const result = await this.invokeFunction(scriptHash, 'balanceOf', [
        Neon.sc.ContractParam.hash160(address),
      ]);

      return this.parseStackItem(result);
    } catch (error) {
      console.error('Error getting address balance:', error);
      return '0';
    }
  }

  async getTransactionHistory(
    address: string,
    limit: number = 50
  ): Promise<TransactionFlow[]> {
    try {
      // Validate address to prevent request forgery
      if (!this.isValidNeoAddress(address)) {
        throw new Error('Invalid Neo address format');
      }

      const response = await axios.get(
        `${this.dora}/address/${encodeURIComponent(address)}/transfers`,
        {
          params: { limit, page: 1 },
          timeout: 30000,
        }
      );

      if (response.data && response.data.items) {
        return response.data.items.map((item: any) => ({
          from: item.from || '',
          to: item.to || '',
          amount: item.amount || '0',
          timestamp: item.timestamp || Date.now(),
          txHash: item.transaction_hash || '',
        }));
      }

      return [];
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }

  private async invokeFunction(
    scriptHash: string,
    operation: string,
    args: any[]
  ): Promise<any> {
    try {
      const result = await this.rpcClient.invokeFunction(
        scriptHash,
        operation,
        args
      );

      if (result.state === 'HALT' && result.stack && result.stack.length > 0) {
        return result.stack[0];
      }

      throw new Error(`Contract invocation failed: ${result.state}`);
    } catch (error) {
      console.error('Error invoking function:', error);
      throw error;
    }
  }

  private parseStackItem(item: any): string {
    if (!item) return '';

    switch (item.type) {
      case 'ByteString':
        try {
          return Neon.u.hexstring2str(item.value);
        } catch {
          return item.value;
        }
      case 'Integer':
        return item.value;
      case 'Boolean':
        return item.value.toString();
      default:
        return item.value || '';
    }
  }

  /**
   * Validate Neo script hash format (0x prefixed hex string, 40 chars)
   */
  private isValidScriptHash(scriptHash: string): boolean {
    const scriptHashRegex = /^0x[a-fA-F0-9]{40}$/;
    return scriptHashRegex.test(scriptHash);
  }

  /**
   * Validate Neo address format (Base58 encoded, starts with N, 34 chars)
   */
  private isValidNeoAddress(address: string): boolean {
    const addressRegex = /^N[a-km-zA-HJ-NP-Z1-9]{33}$/;
    return addressRegex.test(address);
  }
}
