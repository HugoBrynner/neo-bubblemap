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

export interface DistributionAnalysis {
  giniCoefficient: number;
  top10Concentration: number;
  top50Concentration: number;
  uniqueHolders: number;
}

export interface ClusterAnalysis {
  whales: AddressCluster;
  exchanges: AddressCluster;
  contracts: AddressCluster;
  retail: AddressCluster;
}

export interface AnalysisData {
  tokenInfo: TokenInfo;
  distribution: DistributionAnalysis;
  clusters: ClusterAnalysis;
  timestamp: number;
}
