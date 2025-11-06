import axios from 'axios';
import { BubbleMapData, Token, AddressDetails, FilterOptions } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  });

  async getTokens(): Promise<Token[]> {
    const response = await this.api.get('/tokens');
    return response.data.data;
  }

  async getBubbleMapData(
    tokenScriptHash: string,
    filters?: FilterOptions
  ): Promise<BubbleMapData> {
    const params = new URLSearchParams();
    
    if (filters?.minBalance !== undefined) {
      params.append('minBalance', filters.minBalance.toString());
    }
    if (filters?.maxBalance !== undefined) {
      params.append('maxBalance', filters.maxBalance.toString());
    }
    if (filters?.cluster) {
      params.append('cluster', filters.cluster);
    }

    const response = await this.api.get(`/bubblemap/${tokenScriptHash}?${params.toString()}`);
    return response.data.data;
  }

  async getAddressDetails(address: string, tokenScriptHash: string): Promise<AddressDetails> {
    const response = await this.api.get(`/address/${address}`, {
      params: { token: tokenScriptHash },
    });
    return response.data.data;
  }

  async clearCache(): Promise<void> {
    await this.api.post('/cache/clear');
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get('/health');
      return response.data.success;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
