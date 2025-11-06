import React from 'react';

interface Token {
  name: string;
  symbol: string;
  contract: string;
}

interface TokenSelectorProps {
  selectedToken: string;
  onTokenSelect: (contract: string) => void;
}

const AVAILABLE_TOKENS: Token[] = [
  {
    name: 'NEO Token',
    symbol: 'NEO',
    contract: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5'
  },
  {
    name: 'GAS Token',
    symbol: 'GAS',
    contract: '0xd2a4cff31913016155e38e474a2c06d08be276cf'
  }
];

const TokenSelector: React.FC<TokenSelectorProps> = ({ selectedToken, onTokenSelect }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="token-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>
        Select Token:
      </label>
      <select
        id="token-select"
        value={selectedToken}
        onChange={(e) => onTokenSelect(e.target.value)}
        style={{
          padding: '8px 12px',
          fontSize: '14px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          cursor: 'pointer'
        }}
      >
        <option value="">-- Select a token --</option>
        {AVAILABLE_TOKENS.map((token) => (
          <option key={token.contract} value={token.contract}>
            {token.symbol} - {token.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TokenSelector;
