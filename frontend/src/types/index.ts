export interface TokenHolder {
  address: string;
  balance: string;
  balanceNumeric?: number;
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

export interface Token {
  symbol: string;
  scriptHash: string;
  name: string;
}

export interface TransactionFlow {
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  txHash: string;
}

export interface AddressDetails {
  address: string;
  balance: string;
  transactions: TransactionFlow[];
  timestamp: number;
}

export interface FilterOptions {
  minBalance?: number;
  maxBalance?: number;
  cluster?: string;
}
