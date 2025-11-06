import { AddressData, ClusterData, TokenHolder } from '../types';
import { config } from '../utils/config';

export class ClusteringService {
  /**
   * Analyze token holders and group them into clusters
   */
  analyzeHolders(holders: AddressData[], totalSupply: number): ClusterData[] {
    const clusters: Map<string, ClusterData> = new Map();
    
    holders.forEach((holder, index) => {
      const percentage = (holder.balanceNumeric / totalSupply) * 100;
      const clusterType = this.determineClusterType(holder, percentage);
      const clusterId = `${clusterType}-${Math.floor(index / 10)}`;

      if (!clusters.has(clusterId)) {
        clusters.set(clusterId, {
          clusterId,
          addresses: [],
          totalBalance: '0',
          percentage: 0,
          type: clusterType,
        });
      }

      const cluster = clusters.get(clusterId)!;
      cluster.addresses.push(holder.address);
      cluster.totalBalance = (
        parseFloat(cluster.totalBalance) + holder.balanceNumeric
      ).toString();
      cluster.percentage += percentage;

      // Assign cluster to holder
      holder.cluster = clusterId;
    });

    return Array.from(clusters.values());
  }

  /**
   * Determine the type of cluster for an address
   */
  private determineClusterType(
    holder: AddressData,
    percentage: number
  ): 'whale' | 'exchange' | 'contract' | 'normal' {
    // Whale: holds more than threshold of total supply
    if (percentage >= config.whaleThreshold * 100) {
      return 'whale';
    }

    // Exchange: high transaction count (heuristic)
    if (holder.transactionCount && holder.transactionCount > 1000) {
      return 'exchange';
    }

    // Contract: address pattern or no transaction history
    if (this.looksLikeContract(holder.address)) {
      return 'contract';
    }

    return 'normal';
  }

  /**
   * Simple heuristic to identify contract addresses
   * Note: This is a placeholder implementation. In production, you should:
   * - Query the blockchain to check if the address is a deployed contract
   * - Maintain a list of known contract addresses
   * - Use pattern analysis on transaction behavior
   */
  private looksLikeContract(address: string): boolean {
    // For now, return false to avoid false positives
    // All Neo addresses start with 'N' and are 34 chars, so we can't distinguish based on format alone
    // This should be enhanced with actual contract verification via RPC
    return false;
  }

  /**
   * Convert address data to token holder format with clustering
   */
  toTokenHolders(addresses: AddressData[], totalSupply: number): TokenHolder[] {
    return addresses.map((addr) => ({
      address: addr.address,
      balance: addr.balance,
      percentage: (addr.balanceNumeric / totalSupply) * 100,
      cluster: addr.cluster,
    }));
  }

  /**
   * Detect suspicious groupings based on transaction patterns
   */
  detectSuspiciousGroups(holders: AddressData[]): string[][] {
    // This is a placeholder for more sophisticated analysis
    // Could include:
    // - Addresses that frequently transact with each other
    // - Addresses with similar transaction patterns
    // - Addresses created in the same block
    const suspicious: string[][] = [];
    
    // Simple example: group addresses with same balance (could be related)
    const balanceGroups = new Map<string, string[]>();
    
    holders.forEach((holder) => {
      const balance = holder.balance;
      if (!balanceGroups.has(balance)) {
        balanceGroups.set(balance, []);
      }
      balanceGroups.get(balance)!.push(holder.address);
    });

    // Return groups with more than 3 addresses
    balanceGroups.forEach((addresses) => {
      if (addresses.length > 3) {
        suspicious.push(addresses);
      }
    });

    return suspicious;
  }
}
