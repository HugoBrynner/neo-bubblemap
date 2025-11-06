export interface AddressData {
  address: string;
  balance: string;
  balanceNumeric: number;
  lastActivityBlock?: number;
  lastActivityTime?: string;
  transactionCount?: number;
  cluster?: string;
}

export interface TokenHolder {
  address: string;
  balance: string;
  percentage: number;
  cluster?: string;
}

export interface ClusterData {
  clusterId: string;
  addresses: string[];
  totalBalance: string;
  percentage: number;
  type: 'whale' | 'exchange' | 'contract' | 'normal';
}

export interface BubbleMapData {
  token: string;
  tokenName: string;
  totalSupply: string;
  holders: TokenHolder[];
  clusters: ClusterData[];
  timestamp: number;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: string;
  scriptHash: string;
}

export interface TransactionFlow {
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  txHash: string;
}

export interface FilterOptions {
  token?: string;
  minBalance?: number;
  maxBalance?: number;
  cluster?: string;
  startTime?: number;
  endTime?: number;
}
