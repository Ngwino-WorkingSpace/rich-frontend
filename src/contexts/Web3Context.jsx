import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkWalletConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await setupProvider(accounts[0]);
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setupProvider(accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask or another Web3 wallet');
      throw new Error('No wallet found');
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      await setupProvider(accounts[0]);
      return accounts[0];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const setupProvider = async (address) => {
    try {
      if (!window.ethereum) {
        throw new Error('No wallet detected');
      }

      // Create provider (ethers v6 BrowserProvider doesn't have ready method)
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get signer
      const web3Signer = await web3Provider.getSigner();
      
      // Verify the signer address matches
      const signerAddress = await web3Signer.getAddress();
      if (signerAddress.toLowerCase() !== address.toLowerCase()) {
        throw new Error('Address mismatch');
      }

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(signerAddress);
      
      // Store in localStorage
      localStorage.setItem('walletAddress', signerAddress);
      
      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error('Error setting up provider:', err);
      setError(err.message || 'Failed to setup wallet provider');
      throw err;
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('userToken');
  };

  const signMessage = async (message) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await signer.signMessage(message);
      return signature;
    } catch (err) {
      if (err.code === 4001) {
        throw new Error('User rejected signature request');
      }
      throw err;
    }
  };

  const value = {
    account,
    provider,
    signer,
    isConnecting,
    error,
    connectWallet,
    disconnect,
    signMessage,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

