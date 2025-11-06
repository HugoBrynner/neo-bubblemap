import { TokenHolder, AddressCluster, BubbleData, BubbleMapData, TokenInfo, ClusterAnalysis } from '../types';

export class DataProcessor {
  private readonly WHALE_THRESHOLD = 1; // 1% of total supply
  private readonly EXCHANGE_PATTERNS = ['exchange', 'binance', 'huobi', 'okex', 'gate'];

  processHoldersForBubbleMap(
    holders: TokenHolder[],
    tokenInfo: TokenInfo,
    maxBubbles: number = 100
  ): BubbleMapData {
    const clusters = this.identifyClusters(holders);
    const bubbles = this.createBubbles(holders, clusters, maxBubbles);

    return {
      token: { ...tokenInfo, holders: holders.length },
      bubbles,
      clusters,
      totalHolders: holders.length,
      lastUpdate: Date.now()
    };
  }

  private identifyClusters(holders: TokenHolder[]): AddressCluster[] {
    const clusters: AddressCluster[] = [];
    
    // Identify whales (holders with >1% of supply)
    const whales = holders.filter(h => h.percentage >= this.WHALE_THRESHOLD);
    if (whales.length > 0) {
      clusters.push({
        id: 'whales',
        name: 'Whales',
        type: 'whale',
        addresses: whales.map(h => h.address),
        totalBalance: whales.reduce((sum, h) => sum + h.balance, 0),
        percentage: whales.reduce((sum, h) => sum + h.percentage, 0)
      });
    }

    // Identify potential exchanges (by pattern matching)
    const exchanges = holders.filter(h => 
      this.EXCHANGE_PATTERNS.some(pattern => 
        h.address.toLowerCase().includes(pattern)
      )
    );
    if (exchanges.length > 0) {
      clusters.push({
        id: 'exchanges',
        name: 'Exchanges',
        type: 'exchange',
        addresses: exchanges.map(h => h.address),
        totalBalance: exchanges.reduce((sum, h) => sum + h.balance, 0),
        percentage: exchanges.reduce((sum, h) => sum + h.percentage, 0)
      });
    }

    // Identify medium holders (0.1% - 1%)
    const mediumHolders = holders.filter(
      h => h.percentage >= 0.1 && h.percentage < this.WHALE_THRESHOLD
    );
    if (mediumHolders.length > 0) {
      clusters.push({
        id: 'medium',
        name: 'Medium Holders',
        type: 'medium',
        addresses: mediumHolders.map(h => h.address),
        totalBalance: mediumHolders.reduce((sum, h) => sum + h.balance, 0),
        percentage: mediumHolders.reduce((sum, h) => sum + h.percentage, 0)
      });
    }

    // Identify retail holders (<0.1%)
    const retailHolders = holders.filter(h => h.percentage < 0.1);
    if (retailHolders.length > 0) {
      clusters.push({
        id: 'retail',
        name: 'Retail Holders',
        type: 'retail',
        addresses: retailHolders.map(h => h.address),
        totalBalance: retailHolders.reduce((sum, h) => sum + h.balance, 0),
        percentage: retailHolders.reduce((sum, h) => sum + h.percentage, 0)
      });
    }

    // Identify dormant addresses (no activity in 180 days)
    const dormantThreshold = Date.now() - (180 * 86400000);
    const dormant = holders.filter(h => 
      h.lastActivity && h.lastActivity < dormantThreshold
    );
    if (dormant.length > 0) {
      clusters.push({
        id: 'dormant',
        name: 'Dormant Addresses',
        type: 'dormant',
        addresses: dormant.map(h => h.address),
        totalBalance: dormant.reduce((sum, h) => sum + h.balance, 0),
        percentage: dormant.reduce((sum, h) => sum + h.percentage, 0)
      });
    }

    return clusters;
  }

  private createBubbles(
    holders: TokenHolder[],
    clusters: AddressCluster[],
    maxBubbles: number
  ): BubbleData[] {
    // Take top holders up to maxBubbles
    const topHolders = holders.slice(0, maxBubbles);
    
    return topHolders.map((holder, index) => {
      const cluster = this.findClusterForAddress(holder, clusters);
      
      return {
        id: `bubble-${index}`,
        address: holder.address,
        balance: holder.balance,
        percentage: holder.percentage,
        cluster: cluster?.id,
        clusterName: cluster?.name,
        lastActivity: holder.lastActivity,
        label: this.generateLabel(holder, index)
      };
    });
  }

  private findClusterForAddress(
    holder: TokenHolder,
    clusters: AddressCluster[]
  ): AddressCluster | undefined {
    return clusters.find(cluster => 
      cluster.addresses.includes(holder.address)
    );
  }

  private generateLabel(holder: TokenHolder, index: number): string {
    if (index < 3) {
      return `Top ${index + 1}`;
    }
    if (holder.percentage >= this.WHALE_THRESHOLD) {
      return 'Whale';
    }
    if (holder.percentage >= 0.5) {
      return 'Large Holder';
    }
    if (holder.percentage >= 0.1) {
      return 'Medium Holder';
    }
    return 'Holder';
  }

  analyzeDistribution(holders: TokenHolder[]): {
    giniCoefficient: number;
    top10Concentration: number;
    top50Concentration: number;
    uniqueHolders: number;
  } {
    const top10 = holders.slice(0, 10);
    const top50 = holders.slice(0, 50);

    return {
      giniCoefficient: this.calculateGiniCoefficient(holders),
      top10Concentration: top10.reduce((sum, h) => sum + h.percentage, 0),
      top50Concentration: top50.reduce((sum, h) => sum + h.percentage, 0),
      uniqueHolders: holders.length
    };
  }

  private calculateGiniCoefficient(holders: TokenHolder[]): number {
    if (holders.length === 0) return 0;

    const balances = holders.map(h => h.balance).sort((a, b) => a - b);
    const n = balances.length;
    const sumOfProducts = balances.reduce((sum, balance, i) => {
      return sum + balance * (i + 1);
    }, 0);
    
    const totalBalance = balances.reduce((sum, b) => sum + b, 0);
    
    if (totalBalance === 0) return 0;
    
    return (2 * sumOfProducts) / (n * totalBalance) - (n + 1) / n;
  }

  filterBubblesByCluster(
    bubbleData: BubbleMapData,
    clusterIds: string[]
  ): BubbleMapData {
    if (clusterIds.length === 0) return bubbleData;

    const filteredBubbles = bubbleData.bubbles.filter(bubble =>
      bubble.cluster && clusterIds.includes(bubble.cluster)
    );

    return {
      ...bubbleData,
      bubbles: filteredBubbles
    };
  }

  filterBubblesByMinBalance(
    bubbleData: BubbleMapData,
    minBalance: number
  ): BubbleMapData {
    const filteredBubbles = bubbleData.bubbles.filter(
      bubble => bubble.balance >= minBalance
    );

    return {
      ...bubbleData,
      bubbles: filteredBubbles
    };
  }

  getClusterAnalysis(holders: TokenHolder[]): ClusterAnalysis {
    const whales = holders.filter(h => h.percentage >= this.WHALE_THRESHOLD);
    const exchanges = holders.filter(h => 
      this.EXCHANGE_PATTERNS.some(pattern => 
        h.address.toLowerCase().includes(pattern)
      )
    );
    const contracts = holders.filter(h => 
      h.address.startsWith('0x') && h.address.length === 42
    );
    const retail = holders.filter(h => h.percentage < 0.1);

    return {
      whales: {
        id: 'whales',
        name: 'Whales',
        type: 'whale',
        addresses: whales.map(h => h.address),
        totalBalance: whales.reduce((sum, h) => sum + h.balance, 0),
        percentage: whales.reduce((sum, h) => sum + h.percentage, 0)
      },
      exchanges: {
        id: 'exchanges',
        name: 'Exchanges',
        type: 'exchange',
        addresses: exchanges.map(h => h.address),
        totalBalance: exchanges.reduce((sum, h) => sum + h.balance, 0),
        percentage: exchanges.reduce((sum, h) => sum + h.percentage, 0)
      },
      contracts: {
        id: 'contracts',
        name: 'Smart Contracts',
        type: 'contract',
        addresses: contracts.map(h => h.address),
        totalBalance: contracts.reduce((sum, h) => sum + h.balance, 0),
        percentage: contracts.reduce((sum, h) => sum + h.percentage, 0)
      },
      retail: {
        id: 'retail',
        name: 'Retail Holders',
        type: 'retail',
        addresses: retail.map(h => h.address),
        totalBalance: retail.reduce((sum, h) => sum + h.balance, 0),
        percentage: retail.reduce((sum, h) => sum + h.percentage, 0)
      }
    };
  }
}
