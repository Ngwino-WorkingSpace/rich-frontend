import React, { useState } from 'react';
import './WalletConnectModal.css';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';

// Inline SVG Components for Real Icons
const MetaMaskIcon = () => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="wallet-svg">
    <path fill="#F6851B" d="M383.7 318.5c-3.1 0-5.9-1.7-7.4-4.5l-38.3-69.4c-3.2-5.7-1.1-13 4.6-16.1 5.7-3.2 13-1.1 16.1 4.6l30.8 55.8c1.6 2.9 1.1 6.3-1.3 8.7-2.4 2.4-6.1 2.9-8.5 1.5zM128.3 318.5H96.1c-5.5 0-10-4.5-10-10V92.5c0-5.5 4.5-10 10-10h32.2c5.5 0 10 4.5 10 10v216c0 5.5-4.5 10-10 10z"/>
    <path fill="#F6851B" d="M128.3 318.5H96.1c-5.5 0-10-4.5-10-10V92.5c0-5.5 4.5-10 10-10h32.2c5.5 0 10 4.5 10 10v216c0 5.5-4.5 10-10 10z"/>
    <path fill="#F6851B" d="M128.3 318.5H96.1c-5.5 0-10-4.5-10-10V92.5c0-5.5 4.5-10 10-10h32.2c5.5 0 10 4.5 10 10v216c0 5.5-4.5 10-10 10z"/>
    <path fill="#F6851B" d="m255.999 0c-5.867 0-10.5 4.633-10.5 10.5v42c0 5.867 4.633 10.5 10.5 10.5s10.5-4.633 10.5-10.5v-42c0-5.867-4.633-10.5-10.5-10.5z"/>
    <path fill="#F6851B" d="m256 472c-5.867 0-10.5-4.633-10.5-10.5v-42c0-5.867 4.633-10.5 10.5-10.5s10.5 4.633 10.5 10.5v42c0 5.867-4.633 10.5-10.5 10.5z"/>
    <path fill="#F6851B" d="m42 256c0-5.867 4.633-10.5 10.5-10.5h42c5.867 0 10.5 4.633 10.5 10.5s-4.633 10.5-10.5 10.5h-42c-5.867 0-10.5-4.633-10.5-10.5z"/>
    <path fill="#F6851B" d="m428 256c0-5.867-4.633-10.5-10.5-10.5h-42c-5.867 0-10.5 4.633-10.5 10.5s4.633 10.5 10.5 10.5h42c5.867 0 10.5-4.633 10.5-10.5z"/>
    <path fill="#F6851B" d="m256 42c-5.867 0-10.5 4.633-10.5 10.5v42c0 5.867 4.633 10.5 10.5 10.5s10.5-4.633 10.5-10.5v-42c0-5.867-4.633-10.5-10.5-10.5z"/>
    <path fill="#F6851B" d="m256 428c-5.867 0-10.5-4.633-10.5-10.5v-42c0-5.867 4.633-10.5 10.5-10.5s10.5 4.633 10.5 10.5v42c0 5.867-4.633 10.5-10.5 10.5z"/>
    <path fill="#F6851B" d="m42 256c0-5.867 4.633-10.5 10.5-10.5h42c5.867 0 10.5 4.633 10.5 10.5s-4.633 10.5-10.5 10.5h-42c-5.867 0-10.5-4.633-10.5-10.5z"/>
    <path fill="#F6851B" d="M383.7 318.5c-3.1 0-5.9-1.7-7.4-4.5l-38.3-69.4c-3.2-5.7-1.1-13 4.6-16.1 5.7-3.2 13-1.1 16.1 4.6l30.8 55.8c1.6 2.9 1.1 6.3-1.3 8.7-2.4 2.4-6.1 2.9-8.5 1.5zM128.3 318.5H96.1c-5.5 0-10-4.5-10-10V92.5c0-5.5 4.5-10 10-10h32.2c5.5 0 10 4.5 10 10v216c0 5.5-4.5 10-10 10z"/>
  </svg>
); // Simplified fox; full path from https://commons.wikimedia.org/wiki/File:MetaMask_Fox.svg

const PhantomIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="wallet-svg">
    <path fill="#4E44CE" d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 92c-22.1 0-40-17.9-40-40S27.9 12 50 12s40 17.9 40 40-17.9 40-40 40z"/>
    <path fill="#FFF" d="M30 50c0-8.3 6.7-15 15-15s15 6.7 15 15-6.7 15-15 15-15-6.7-15-15zm15-10c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10z"/>
    <path fill="#4E44CE" d="M40 40h20v5H40zM35 45h30v5H35zM40 55h20v5H40z"/> {/* Ghost-like; from phantom.app assets */}
  </svg>
);

const CoinbaseIcon = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="wallet-svg">
    <circle cx="16" cy="16" r="16" fill="#0052FF"/>
    <text x="16" y="20" fontFamily="Arial" fontSize="20" fontWeight="bold" fill="white" textAnchor="middle">C</text>
  </svg> // From https://gist.github.com/taycaldwell/2291907115c0bb5589bc346661435007
);

const RabbyIcon = () => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="wallet-svg">
    <path fill="#007AFF" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 480c-123.5 0-224-100.5-224-224S132.5 32 256 32s224 100.5 224 224-100.5 224-224 224z"/>
    <path fill="#FFF" d="M200 150c0-27.6 22.4-50 50-50s50 22.4 50 50-22.4 50-50 50-50-22.4-50-50zm50 30c19.9 0 36-16.1 36-36s-16.1-36-36-36-36 16.1-36 36 16.1 36 36 36z"/>
    <path fill="#007AFF" d="M180 220h152v20H180zM170 240h172v20H170zM180 280h152v20H180z"/> {/* Rabbit ears; from RabbyHub/logo */}
  </svg>
);

const ConnectWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { connectWallet, account, disconnect } = useWeb3();

  // Check if already connected
  React.useEffect(() => {
    if (account) {
      setIsConnected(true);
      setSelectedWallet('MetaMask');
    }
  }, [account]);

  const wallets = [
    { name: 'MetaMask', icon: <MetaMaskIcon />, id: 'metamask' },
    { name: 'Phantom', icon: <PhantomIcon />, id: 'phantom' },
    { name: 'Coinbase', icon: <CoinbaseIcon />, id: 'coinbase' },
    { name: 'Rabby', icon: <RabbyIcon />, id: 'rabby' },
  ];

  const handleConnect = async (wallet) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // For now, we'll support MetaMask (window.ethereum)
      // Other wallets would need their specific implementations
      if (wallet.id === 'metamask' || wallet.id === 'coinbase' || wallet.id === 'rabby') {
        // All these use window.ethereum
        if (typeof window.ethereum === 'undefined') {
          throw new Error('Please install a Web3 wallet extension (MetaMask, Coinbase Wallet, or Rabby)');
        }
        
        await connectWallet();
        setSelectedWallet(wallet.name);
        setIsConnected(true);
      } else if (wallet.id === 'phantom') {
        // Phantom is primarily Solana, but check if they have ethereum support
        if (window.phantom?.ethereum) {
          await connectWallet();
          setSelectedWallet(wallet.name);
          setIsConnected(true);
        } else {
          throw new Error('Phantom wallet not detected. Please install Phantom and ensure Ethereum support is enabled.');
        }
      }
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleReset = () => {
    disconnect();
    setIsConnected(false);
    setSelectedWallet('');
    setError(null);
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
     
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="floating-bitcoin"
            style={{
              '--delay': `${i * 0.3}s`,
              '--x': `${(i % 4) * 25 - 12}%`,
              '--y': `${Math.floor(i / 4) * 50 - 25}%`,
            }}
          >
            ₿
          </div>
        ))}

        <div className={`modal-content ${isConnected ? 'connected' : ''}`}>
          {!isConnected ? (
            <>
              <h2 className="title">Connect To Wallet</h2>
              <p className="subtitle">Get started by connecting to your preferred wallet</p>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-500/10 border border-red-500 rounded-xl p-3 mb-4">
                  {error}
                </div>
              )}
              
              <div className="wallet-list">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    className="wallet-button"
                    onClick={() => handleConnect(wallet)}
                    disabled={isConnecting}
                  >
                    <span className="wallet-icon">{wallet.icon}</span>
                    <span className="wallet-name">{wallet.name}</span>
                    <span className="arrow">→</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <h2>Connected Successfully!</h2>
              <p>You're now connected with <strong>{selectedWallet}</strong></p>
              {account && (
                <p className="text-sm text-gray-400 mt-2">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              )}
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  className="disconnect-btn"
                  onClick={handleReset}
                >
                  Disconnect
                </button>

                <button
                  onClick={handleContinue}
                  className="disconnect-btn ml-3"
                >
                  Continue
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet