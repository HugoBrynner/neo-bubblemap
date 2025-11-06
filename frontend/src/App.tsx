import React, { useState, useEffect } from 'react';
import { apiService } from './services/api.service';
import { BubbleMapData, Token, TokenHolder, FilterOptions } from './types';
import BubbleMap from './components/BubbleMap';
import FilterPanel from './components/FilterPanel';
import AddressModal from './components/AddressModal';

const App: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [bubbleMapData, setBubbleMapData] = useState<BubbleMapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedHolder, setSelectedHolder] = useState<TokenHolder | null>(null);

  useEffect(() => {
    loadTokens();
  }, []);

  useEffect(() => {
    if (selectedToken) {
      loadBubbleMapData(selectedToken.scriptHash, filters);
    }
  }, [selectedToken, filters]);

  const loadTokens = async () => {
    try {
      const tokenList = await apiService.getTokens();
      setTokens(tokenList);
      if (tokenList.length > 0) {
        setSelectedToken(tokenList[0]);
      }
    } catch (err) {
      console.error('Failed to load tokens:', err);
      setError('Failed to load available tokens');
    }
  };

  const loadBubbleMapData = async (tokenScriptHash: string, filterOptions: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getBubbleMapData(tokenScriptHash, filterOptions);
      setBubbleMapData(data);
    } catch (err) {
      console.error('Failed to load bubble map data:', err);
      setError('Failed to load token distribution data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenChange = (scriptHash: string) => {
    const token = tokens.find((t) => t.scriptHash === scriptHash);
    if (token) {
      setSelectedToken(token);
      setFilters({});
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    if (selectedToken) {
      loadBubbleMapData(selectedToken.scriptHash, filters);
    }
  };

  const handleBubbleClick = (holder: TokenHolder) => {
    setSelectedHolder(holder);
  };

  const handleCloseModal = () => {
    setSelectedHolder(null);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px 30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
              Neo Bubblemap
            </h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              Visualize token distributions and address clusters on Neo blockchain
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <select
              value={selectedToken?.scriptHash || ''}
              onChange={(e) => handleTokenChange(e.target.value)}
              style={{
                padding: '10px 15px',
                fontSize: '16px',
                border: 'none',
                borderRadius: '6px',
                background: 'white',
                color: '#333',
                cursor: 'pointer',
                minWidth: '150px',
              }}
            >
              {tokens.map((token) => (
                <option key={token.scriptHash} value={token.scriptHash}>
                  {token.symbol} - {token.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: '300px',
            background: '#f5f5f5',
            padding: '20px',
            overflowY: 'auto',
            borderRight: '1px solid #e0e0e0',
          }}
        >
          {bubbleMapData && (
            <>
              <div
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>
                  Token Info
                </h3>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Token:</strong> {bubbleMapData.token}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Name:</strong> {bubbleMapData.tokenName}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Total Supply:</strong> {bubbleMapData.totalSupply}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Holders:</strong> {bubbleMapData.holders.length}
                  </div>
                  <div>
                    <strong>Clusters:</strong> {bubbleMapData.clusters.length}
                  </div>
                </div>
              </div>

              <FilterPanel
                clusters={bubbleMapData.clusters}
                onFilterChange={handleFilterChange}
                onRefresh={handleRefresh}
              />
            </>
          )}
        </aside>

        {/* Main Visualization Area */}
        <main style={{ flex: 1, position: 'relative' }}>
          {loading && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24px',
                color: 'white',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '20px 40px',
                borderRadius: '8px',
                zIndex: 10,
              }}
            >
              Loading...
            </div>
          )}

          {error && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                maxWidth: '400px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
              <div style={{ color: '#c00', marginBottom: '15px', fontWeight: '600' }}>{error}</div>
              <button
                onClick={handleRefresh}
                style={{
                  padding: '10px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && bubbleMapData && (
            <BubbleMap
              holders={bubbleMapData.holders}
              onBubbleClick={handleBubbleClick}
            />
          )}

          {!loading && !error && !bubbleMapData && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'white',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
              <div style={{ fontSize: '20px' }}>Select a token to visualize</div>
            </div>
          )}
        </main>
      </div>

      {/* Address Modal */}
      {selectedHolder && selectedToken && (
        <AddressModal
          holder={selectedHolder}
          tokenScriptHash={selectedToken.scriptHash}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default App;
