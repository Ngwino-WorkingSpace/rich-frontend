import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const BalanceDisplay = ({ account, provider }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const bal = await provider.getBalance(account);
        setBalance(ethers.formatEther(bal));
      } catch (err) {
        console.error('Error fetching balance:', err);
      } finally {
        setLoading(false);
      }
    };

    if (account && provider) {
      fetchBalance();
      // Refresh balance every 10 seconds
      const interval = setInterval(fetchBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [account, provider]);

  if (loading) {
    return <div className="text-gray-400 text-xs">Loading...</div>;
  }

  if (balance === null) {
    return null;
  }

  const balanceNum = parseFloat(balance);
  const isLow = balanceNum < 0.1; // Warn if less than 0.1 ETH

  return (
    <div className={`text-xs ${isLow ? 'text-yellow-400' : 'text-gray-400'}`}>
      Balance: {balanceNum.toFixed(6)} ETH
      {isLow && <span className="block text-yellow-500">⚠ Low balance</span>}
    </div>
  );
};

export default BalanceDisplay;

