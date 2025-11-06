import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api.service';
import { AddressDetails, TokenHolder } from '../types';

interface AddressModalProps {
  holder: TokenHolder;
  tokenScriptHash: string;
  onClose: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ holder, tokenScriptHash, onClose }) => {
  const [details, setDetails] = useState<AddressDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAddressDetails(holder.address, tokenScriptHash);
        setDetails(data);
        setError(null);
      } catch (err) {
        setError('Failed to load address details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [holder.address, tokenScriptHash]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Address Details</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999',
            }}
          >
            ×
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
          </div>
        )}

        {error && (
          <div style={{ padding: '20px', background: '#fee', borderRadius: '8px', color: '#c00' }}>
            {error}
          </div>
        )}

        {!loading && !error && details && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>
                Address
              </label>
              <div
                style={{
                  padding: '12px',
                  background: '#f5f5f5',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  wordBreak: 'break-all',
                }}
              >
                {holder.address}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>
                Balance
              </label>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                {holder.balance}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>
                Percentage of Total Supply
              </label>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ecdc4' }}>
                {holder.percentage.toFixed(4)}%
              </div>
            </div>

            {holder.cluster && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>
                  Cluster
                </label>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  {holder.cluster}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#666', fontSize: '14px', fontWeight: '600' }}>
                Recent Transactions ({details.transactions.length})
              </label>
              {details.transactions.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  No recent transactions
                </div>
              ) : (
                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {details.transactions.slice(0, 10).map((tx, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '12px',
                        marginBottom: '8px',
                        background: '#f9f9f9',
                        borderRadius: '6px',
                        fontSize: '13px',
                      }}
                    >
                      <div style={{ marginBottom: '4px' }}>
                        <strong>From:</strong>{' '}
                        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                          {tx.from ? `${tx.from.substring(0, 10)}...` : 'N/A'}
                        </span>
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <strong>To:</strong>{' '}
                        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                          {tx.to ? `${tx.to.substring(0, 10)}...` : 'N/A'}
                        </span>
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Amount:</strong> {tx.amount}
                      </div>
                      <div style={{ color: '#999', fontSize: '12px' }}>
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressModal;
