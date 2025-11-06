import React from 'react';
import { AnalysisData } from '../types';

interface StatisticsPanelProps {
  analysis: AnalysisData | null;
  loading: boolean;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ analysis, loading }) => {
  if (loading) {
    return <div>Loading statistics...</div>;
  }

  if (!analysis) {
    return null;
  }

  const { tokenInfo, distribution, clusters } = analysis;

  return (
    <div style={{
      padding: '20px',
      background: '#fff',
      borderRadius: '8px',
      border: '1px solid #ddd',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Token Statistics</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '10px' }}>{tokenInfo.name} ({tokenInfo.symbol})</h4>
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <div><strong>Total Supply:</strong> {tokenInfo.totalSupply.toLocaleString()}</div>
          <div><strong>Holders:</strong> {tokenInfo.holders.toLocaleString()}</div>
          <div><strong>Decimals:</strong> {tokenInfo.decimals}</div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '10px' }}>Distribution Analysis</h4>
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <div><strong>Gini Coefficient:</strong> {distribution.giniCoefficient.toFixed(4)}</div>
          <div><strong>Top 10 Concentration:</strong> {distribution.top10Concentration.toFixed(2)}%</div>
          <div><strong>Top 50 Concentration:</strong> {distribution.top50Concentration.toFixed(2)}%</div>
          <div><strong>Unique Holders:</strong> {distribution.uniqueHolders.toLocaleString()}</div>
        </div>
      </div>

      <div>
        <h4 style={{ marginBottom: '10px' }}>Cluster Breakdown</h4>
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <div><strong>Whales:</strong> {clusters.whales.addresses.length} addresses ({clusters.whales.percentage.toFixed(2)}%)</div>
          <div><strong>Exchanges:</strong> {clusters.exchanges.addresses.length} addresses ({clusters.exchanges.percentage.toFixed(2)}%)</div>
          <div><strong>Smart Contracts:</strong> {clusters.contracts.addresses.length} addresses ({clusters.contracts.percentage.toFixed(2)}%)</div>
          <div><strong>Retail:</strong> {clusters.retail.addresses.length} addresses ({clusters.retail.percentage.toFixed(2)}%)</div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
