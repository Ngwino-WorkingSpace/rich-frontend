import React, { useState, useEffect } from 'react';
import assets from '../assets/assets';
import { useWeb3 } from '../contexts/Web3Context';
import { api } from '../services/api';

const Recent = () => {
  const { account } = useWeb3();
  const [trades, setTrades] = useState([]);
  const [activeTab, setActiveTab] = useState('Completed');
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState([
    { label: 'Pending', icon: assets.pendingIcon, active: false, count: 0 },
    { label: 'Completed', icon: assets.completedIcon, active: true, count: 0 },
    { label: 'Cancelled', icon: assets.cancelledIcon, active: false, count: 0 },
  ]);

  useEffect(() => {
    if (account) {
      fetchTransactions();
    } else {
      setLoading(false);
      setTrades([]);
    }
  }, [account]);

  const fetchTransactions = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      const response = await api.getTransactions(account);
      const transactions = response.txs || [];
      
      // Map backend transactions to trade format
      const mappedTrades = transactions.map((tx) => {
        const date = new Date(tx.createdAt || tx.created);
        const formattedDate = date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        // Determine status based on transaction type and pool status
        let status = 'Completed';
        if (tx.type === 'deposit' || tx.type === 'buy') {
          status = 'Completed';
        } else if (tx.type === 'withdraw') {
          status = 'Pending';
        } else if (tx.type === 'refund') {
          status = 'Cancelled';
        }
        
        // Map transaction type to Buy/Sell
        const type = (tx.type === 'deposit' || tx.type === 'buy') ? 'Buy' : 'Sell';
        
        // Get BTC price for display (simplified)
        const amount = tx.amount || 0;
        const btcPrice = 68350; // Approximate BTC price, could be fetched from API
        const btcAmount = (amount / btcPrice).toFixed(4); // Approximate conversion
        
        return {
          type,
          pair: 'BTC/USD',
          amount: btcAmount,
          price: `$${btcPrice.toLocaleString()}`,
          total: `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          date: formattedDate,
          status,
          statusIcon: status === 'Completed' ? assets.statusCompleted : status === 'Pending' ? assets.statusPending : assets.statusCancelled,
          txHash: tx.txHash
        };
      });
      
      setTrades(mappedTrades);
      
      // Update tab counts
      const pendingCount = mappedTrades.filter(t => t.status === 'Pending').length;
      const completedCount = mappedTrades.filter(t => t.status === 'Completed').length;
      const cancelledCount = mappedTrades.filter(t => t.status === 'Cancelled').length;
      
      setTabs([
        { label: 'Pending', icon: assets.pendingIcon, active: activeTab === 'Pending', count: pendingCount },
        { label: 'Completed', icon: assets.completedIcon, active: activeTab === 'Completed', count: completedCount },
        { label: 'Cancelled', icon: assets.cancelledIcon, active: activeTab === 'Cancelled', count: cancelledCount },
      ]);
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);
    setTabs(tabs.map(tab => ({
      ...tab,
      active: tab.label === tabLabel
    })));
  };

  // Filter trades by active tab
  const filteredTrades = activeTab === 'All' 
    ? trades 
    : trades.filter(trade => trade.status === activeTab);

  return (
    <div className="bg-black border border-gray-700 rounded-xl p-6 shadow-xl h-full flex flex-col font-poppins">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold font-poppins bg-gradient-to-r from-white via-yellow-200 to-yellow-500 bg-clip-text text-transparent">RECENT TRADES</h2>
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-base font-bold px-4 py-2 rounded-full font-poppins">
          {tabs.reduce((sum, tab) => sum + tab.count, 0)} Total
        </div>
      </div>
      <div className="flex gap-4 mb-8 border-b border-gray-800 font-poppins">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab.label)}
            className={`flex items-center gap-2 pb-3 px-1 transition-all font-poppins ${
              tab.active
                ? 'border-b-2 border-yellow-400 text-yellow-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <img src={tab.icon} alt={tab.label} className="w-5 h-5" />
            <span className="text-base font-medium font-poppins">{tab.label}</span>
            {tab.count > 0 && (
              <span className={`text-sm font-poppins ${tab.active ? 'text-yellow-300' : 'text-gray-400'}`}>
                ({tab.count})
              </span>
            )}
          </button>
        ))}
      </div>
    
      <div className="flex-1 font-poppins overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
        <div className="hide-scrollbar">
          <table className="w-full text-sm font-poppins">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800 font-poppins">
                <th className="text-left pb-4 text-base font-semibold font-poppins">Active Trades</th>
                <th className="text-left pb-4 text-base font-semibold font-poppins">BTC Amount</th>
                <th className="text-left pb-4 text-base font-semibold font-poppins">Price(USD)</th>
                <th className="text-left pb-4 text-base font-semibold font-poppins">Total Value</th>
                <th className="text-left pb-4 text-base font-semibold font-poppins">Date/Time</th>
                <th className="text-left pb-4 text-base font-semibold font-poppins">Status</th>
              </tr>
            </thead>
            <tbody className="font-poppins">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    {account ? 'No transactions found' : 'Please connect your wallet'}
                  </td>
                </tr>
              ) : (
                filteredTrades.map((trade, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-900/50 transition font-poppins">
                  <td className="py-4 font-poppins">
                    <span className={`text-base font-medium font-poppins ${trade.type === 'Buy' ? 'text-yellow-400' : 'text-white'}`}>
                      {trade.type} {trade.pair}
                    </span>
                  </td>
                  <td className="py-4 text-gray-300 text-base font-poppins">{trade.amount}</td>
                  <td className="py-4 text-gray-300 text-base font-poppins">{trade.price}</td>
                  <td className="py-4 text-gray-300 text-base font-poppins">{trade.total}</td>
                  <td className="py-4 text-gray-400 text-base font-poppins">{trade.date}</td>
                  <td className="py-4 font-poppins">
                    <img
                      src={trade.statusIcon}
                      alt={trade.status}
                      className="w-5 h-5"
                    />
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Recent;