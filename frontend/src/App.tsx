import React, { useState, useEffect } from 'react';
import BubbleMap from './components/BubbleMap';
import TokenSelector from './components/TokenSelector';
import FilterPanel from './components/FilterPanel';
import StatisticsPanel from './components/StatisticsPanel';
import { api } from './services/api';
import { BubbleMapData, BubbleData, AnalysisData } from './types';
import './App.css';

const App: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [bubbleMapData, setBubbleMapData] = useState<BubbleMapData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [filteredBubbles, setFilteredBubbles] = useState<BubbleData[]>([]);
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBubble, setSelectedBubble] = useState<BubbleData | null>(null);

  useEffect(() => {
    if (selectedToken) {
      loadTokenData(selectedToken);
    }
  }, [selectedToken]);

  useEffect(() => {
    if (bubbleMapData) {
      applyFilters();
    }
  }, [bubbleMapData, selectedClusters]);

  const loadTokenData = async (contractHash: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [bubbleData, analysis] = await Promise.all([
        api.getBubbleMapData(contractHash, 100),
        api.getAnalysis(contractHash)
      ]);
      
      setBubbleMapData(bubbleData);
      setAnalysisData(analysis);
      setSelectedClusters([]);
    } catch (err) {
      console.error('Error loading token data:', err);
      setError('Failed to load token data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!bubbleMapData) return;

    let filtered = bubbleMapData.bubbles;

    if (selectedClusters.length > 0) {
      filtered = filtered.filter(bubble => 
        bubble.cluster && selectedClusters.includes(bubble.cluster)
      );
    }

    setFilteredBubbles(filtered);
  };

  const handleClusterToggle = (clusterId: string) => {
    setSelectedClusters(prev => {
      if (prev.includes(clusterId)) {
        return prev.filter(id => id !== clusterId);
      } else {
        return [...prev, clusterId];
      }
    });
  };

  const handleResetFilters = () => {
    setSelectedClusters([]);
  };

  const handleBubbleClick = (bubble: BubbleData) => {
    setSelectedBubble(bubble);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Neo BubbleMap</h1>
        <p>Interactive Token Distribution Visualization for Neo Blockchain</p>
      </header>

      <main className="app-main">
        <div className="controls-section">
          <TokenSelector
            selectedToken={selectedToken}
            onTokenSelect={setSelectedToken}
          />
          
          {loading && <div className="loading">Loading token data...</div>}
          {error && <div className="error">{error}</div>}
        </div>

        {bubbleMapData && (
          <div className="content-grid">
            <div className="sidebar">
              <FilterPanel
                clusters={bubbleMapData.clusters}
                selectedClusters={selectedClusters}
                onClusterToggle={handleClusterToggle}
                onResetFilters={handleResetFilters}
              />
              
              <StatisticsPanel
                analysis={analysisData}
                loading={loading}
              />
            </div>

            <div className="visualization-container">
              <div className="bubble-map-wrapper">
                <h2 style={{ marginBottom: '10px' }}>
                  {bubbleMapData.token.symbol} Token Distribution
                </h2>
                <p style={{ marginBottom: '20px', color: '#666' }}>
                  Showing {filteredBubbles.length} of {bubbleMapData.totalHolders} holders
                </p>
                
                <BubbleMap
                  data={filteredBubbles}
                  onBubbleClick={handleBubbleClick}
                  width={1000}
                  height={700}
                />
                
                <div className="legend">
                  <h4>Legend</h4>
                  <p>Bubble size represents holder balance</p>
                  <p>Color represents cluster type</p>
                  <p>Click and drag to pan, scroll to zoom</p>
                  <p>Hover over bubbles for details</p>
                </div>
              </div>

              {selectedBubble && (
                <div className="bubble-details">
                  <h3>Selected Address Details</h3>
                  <div className="detail-content">
                    <p><strong>Address:</strong> {selectedBubble.address}</p>
                    <p><strong>Balance:</strong> {selectedBubble.balance.toLocaleString()}</p>
                    <p><strong>Percentage:</strong> {selectedBubble.percentage.toFixed(4)}%</p>
                    <p><strong>Label:</strong> {selectedBubble.label}</p>
                    {selectedBubble.clusterName && (
                      <p><strong>Cluster:</strong> {selectedBubble.clusterName}</p>
                    )}
                    {selectedBubble.lastActivity && (
                      <p><strong>Last Activity:</strong> {new Date(selectedBubble.lastActivity).toLocaleDateString()}</p>
                    )}
                  </div>
                  <button onClick={() => setSelectedBubble(null)}>Close</button>
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedToken && !loading && (
          <div className="welcome-message">
            <h2>Welcome to Neo BubbleMap</h2>
            <p>Select a token from the dropdown above to visualize its holder distribution.</p>
            <p>Features:</p>
            <ul>
              <li>Interactive bubble visualization of token holders</li>
              <li>Address clustering and analysis</li>
              <li>Distribution metrics and statistics</li>
              <li>Zoom, pan, and filter capabilities</li>
            </ul>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 Neo BubbleMap - Blockchain Analytics Visualization</p>
      </footer>
    </div>
  );
};

export default App;
