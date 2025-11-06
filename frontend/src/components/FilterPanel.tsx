import React from 'react';
import { AddressCluster } from '../types';

interface FilterPanelProps {
  clusters: AddressCluster[];
  selectedClusters: string[];
  onClusterToggle: (clusterId: string) => void;
  onResetFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  clusters,
  selectedClusters,
  onClusterToggle,
  onResetFilters
}) => {
  return (
    <div style={{
      padding: '20px',
      background: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Filters</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Clusters:</strong>
        <div style={{ marginTop: '10px' }}>
          {clusters.map((cluster) => (
            <label
              key={cluster.id}
              style={{
                display: 'block',
                marginBottom: '8px',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={selectedClusters.length === 0 || selectedClusters.includes(cluster.id)}
                onChange={() => onClusterToggle(cluster.id)}
                style={{ marginRight: '8px' }}
              />
              <span>
                {cluster.name} ({cluster.addresses.length} addresses, {cluster.percentage.toFixed(2)}%)
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={onResetFilters}
        style={{
          padding: '8px 16px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterPanel;
