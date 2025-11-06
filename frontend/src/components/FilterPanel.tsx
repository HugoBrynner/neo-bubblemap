import React, { useState } from 'react';
import { FilterOptions, ClusterData } from '../types';

interface FilterPanelProps {
  clusters: ClusterData[];
  onFilterChange: (filters: FilterOptions) => void;
  onRefresh: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ clusters, onFilterChange, onRefresh }) => {
  const [minBalance, setMinBalance] = useState<string>('');
  const [maxBalance, setMaxBalance] = useState<string>('');
  const [selectedCluster, setSelectedCluster] = useState<string>('');

  const handleApplyFilters = () => {
    const filters: FilterOptions = {};
    
    if (minBalance) {
      filters.minBalance = parseFloat(minBalance);
    }
    if (maxBalance) {
      filters.maxBalance = parseFloat(maxBalance);
    }
    if (selectedCluster) {
      filters.cluster = selectedCluster;
    }

    onFilterChange(filters);
  };

  const handleReset = () => {
    setMinBalance('');
    setMaxBalance('');
    setSelectedCluster('');
    onFilterChange({});
  };

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>Filters</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>
          Min Balance
        </label>
        <input
          type="number"
          value={minBalance}
          onChange={(e) => setMinBalance(e.target.value)}
          placeholder="0"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>
          Max Balance
        </label>
        <input
          type="number"
          value={maxBalance}
          onChange={(e) => setMaxBalance(e.target.value)}
          placeholder="Unlimited"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>
          Cluster Type
        </label>
        <select
          value={selectedCluster}
          onChange={(e) => setSelectedCluster(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            background: 'white',
          }}
        >
          <option value="">All Clusters</option>
          {clusters.map((cluster) => (
            <option key={cluster.clusterId} value={cluster.clusterId}>
              {cluster.type} - {cluster.percentage.toFixed(2)}%
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleApplyFilters}
          style={{
            flex: 1,
            padding: '10px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#5568d3'}
          onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          style={{
            flex: 1,
            padding: '10px',
            background: '#e0e0e0',
            color: '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#d0d0d0'}
          onMouseOut={(e) => e.currentTarget.style.background = '#e0e0e0'}
        >
          Reset
        </button>
      </div>

      <button
        onClick={onRefresh}
        style={{
          width: '100%',
          marginTop: '10px',
          padding: '10px',
          background: '#4ecdc4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#45b7ae'}
        onMouseOut={(e) => e.currentTarget.style.background = '#4ecdc4'}
      >
        🔄 Refresh Data
      </button>

      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
        <h4 style={{ marginTop: 0, marginBottom: '10px', color: '#333', fontSize: '14px' }}>
          Legend
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { type: 'whale', color: '#ff6b6b', label: 'Whales (>1%)' },
            { type: 'exchange', color: '#4ecdc4', label: 'Exchanges' },
            { type: 'contract', color: '#45b7d1', label: 'Contracts' },
            { type: 'normal', color: '#95e1d3', label: 'Normal' },
          ].map((item) => (
            <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: item.color,
                }}
              />
              <span style={{ fontSize: '13px', color: '#666' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
