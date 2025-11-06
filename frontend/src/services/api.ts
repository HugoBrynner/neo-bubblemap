import axios from 'axios';
import { BubbleMapData, TokenInfo, AnalysisData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  async getBubbleMapData(contractHash: string, limit: number = 100): Promise<BubbleMapData> {
    const response = await axios.get(`${API_BASE_URL}/bubblemap/${contractHash}`, {
      params: { limit }
    });
    return response.data;
  },

  async getTokenInfo(contractHash: string): Promise<TokenInfo> {
    const response = await axios.get(`${API_BASE_URL}/token/${contractHash}`);
    return response.data;
  },

  async getAnalysis(contractHash: string): Promise<AnalysisData> {
    const response = await axios.get(`${API_BASE_URL}/analysis/${contractHash}`);
    return response.data;
  },

  async getAddressDetails(address: string) {
    const response = await axios.get(`${API_BASE_URL}/address/${address}`);
    return response.data;
  },

  async getBlockchainStatus() {
    const response = await axios.get(`${API_BASE_URL}/status`);
    return response.data;
  }
};
