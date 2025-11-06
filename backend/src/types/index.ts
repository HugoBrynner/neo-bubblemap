export interface TokenHolder {
  address: string;
  balance: number;
  percentage: number;
  lastActivity?: number;
  cluster?: string;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  contract: string;
  totalSupply: number;
  decimals: number;
  holders: number;
}

export interface AddressCluster {
  id: string;
  name: string;
  type: string;
  addresses: string[];
  totalBalance: number;
  percentage: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  token: string;
}

export interface BubbleData {
  id: string;
  address: string;
  balance: number;
  percentage: number;
  cluster?: string;
  clusterName?: string;
  lastActivity?: number;
  label?: string;
}

export interface BubbleMapData {
  token: TokenInfo;
  bubbles: BubbleData[];
  clusters: AddressCluster[];
  totalHolders: number;
  lastUpdate: number;
}

export interface NetworkFlow {
  source: string;
  target: string;
  value: number;
  transactions: number;
}

export interface ClusterAnalysis {
  whales: AddressCluster;
  exchanges: AddressCluster;
  contracts: AddressCluster;
  retail: AddressCluster;
}
