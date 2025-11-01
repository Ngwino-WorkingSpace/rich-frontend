import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { api } from '../services/api';
import { ethers } from 'ethers';

const Wallet = () => {
  const { account, provider } = useWeb3();
  const [balance, setBalance] = useState('0.00');
  const [btcPrice, setBtcPrice] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [account, provider]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch ETH balance
      if (provider && account) {
        const ethBalance = await provider.getBalance(account);
        const formattedBalance = parseFloat(ethers.formatEther(ethBalance));
        setBalance(formattedBalance.toFixed(2));
      }

      // Fetch BTC price
      try {
        const priceResponse = await api.getPrice('btc');
        setBtcPrice(priceResponse.priceUSD);
      } catch (error) {
        console.error('Error fetching BTC price:', error);
      }

      // Fetch user data if available
      if (account) {
        try {
          const userResponse = await api.getUser(account);
          setUserData(userResponse);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate USD balance (ETH * ETH price) - simplified
  const ethPrice = 2700; // Approximate ETH price, could fetch from API
  const usdBalance = (parseFloat(balance) * ethPrice).toFixed(2);

  return (
    <div className="bg-black border border-gray-700 rounded-xl p-6 shadow-xl h-full flex flex-col text-white font-poppins">
      
      <h2 className="text-white text-xl font-semibold mb-6 font-poppins">WALLET</h2>

      {loading ? (
        <div className="text-yellow-400 text-center py-8">Loading wallet data...</div>
      ) : !account ? (
        <div className="text-gray-400 text-center py-8">Please connect your wallet</div>
      ) : (
        <>
          <div className="mb-6">
            <div className="text-yellow-400 text-4xl font-bold font-poppins">
              ${usdBalance ? parseFloat(usdBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
            </div>
            <div className="text-gray-400 text-base font-poppins">USD</div>
          </div>
          {btcPrice && (
            <div className="mb-6">
              <div className="text-white text-2xl font-medium font-poppins">BTC Price</div>
              <div className="text-yellow-400 text-3xl font-bold font-poppins">
                ${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between text-gray-400 text-base mb-2 font-poppins">
              <span>ETH Balance</span>
              <span className="text-white">{balance} ETH</span>
            </div>
          </div>

          {userData && (
            <div className="border-t border-gray-700 pt-4 space-y-2 text-base font-poppins mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Username:</span>
                <span className="text-white font-poppins">{userData.user?.userName || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Wallet:</span>
                <span className="text-white text-right font-mono text-sm font-poppins">
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'N/A'}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Wallet;