'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import BitcoinLogo from '../assets/Bitcoin.png';
import EthereumLogo from '../assets/Ethereum.png';
import { ChevronDown, Tv, Menu, X } from 'lucide-react';
import { api } from '../services/api';
import { useWeb3 } from '../contexts/Web3Context';

const coinsConfig = [
  {
    rank: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    apiSymbol: 'btc',
    logo: BitcoinLogo,
  },
  {
    rank: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    apiSymbol: 'eth',
    logo: EthereumLogo,
  },
];

export default function Market() {
  const { account } = useWeb3();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevPrices, setPrevPrices] = useState({});

  useEffect(() => {
    fetchCoinPrices();
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchCoinPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCoinPrices = async () => {
    setLoading(true);
    try {
      const coinDataPromises = coinsConfig.map(async (coinConfig) => {
        try {
          const response = await api.getPrice(coinConfig.apiSymbol);
          const priceUSD = response.priceUSD || 0;
          const prevPrice = prevPrices[coinConfig.symbol] || priceUSD;
          
          // Calculate 24h change (simplified - in production, backend should provide this)
          const change = prevPrice > 0 ? ((priceUSD - prevPrice) / prevPrice) * 100 : 0;
          const change24h = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
          
          // Store current price for next calculation
          setPrevPrices(prev => ({ ...prev, [coinConfig.symbol]: priceUSD }));
          
          return {
            ...coinConfig,
            price: `$${priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change24h,
            priceUSD, // Store raw price for sorting
            marketCap: 'N/A', // Backend doesn't provide market cap
            volume: 'N/A', // Backend doesn't provide volume
          };
        } catch (error) {
          console.error(`Error fetching ${coinConfig.name} price:`, error);
          return {
            ...coinConfig,
            price: 'N/A',
            change24h: '0%',
            marketCap: 'N/A',
            volume: 'N/A',
          };
        }
      });

      const fetchedCoins = await Promise.all(coinDataPromises);
      setCoins(fetchedCoins);
    } catch (error) {
      console.error('Error fetching coin prices:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row transition-all duration-300">
      {/* Sidebar */}
      <div
        className={`fixed md:static z-30 bg-black border-r border-gray-800 transition-all duration-300 ${
          sidebarOpen ? 'left-0' : '-left-64'
        } md:left-0 w-64 h-screen`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-500/40">
          {/* Left: Sidebar toggle + title */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-md border border-gray-700 hover:bg-gray-800"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-6 h-6 text-yellow-500" /> : <Menu className="w-6 h-6 text-yellow-500" />}
            </button>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-200 to-white bg-clip-text text-transparent">
              Markets
            </h1>
          </div>

          {/* Right: Profile button */}
          <div className="flex items-center bg-black px-4 py-1 rounded-full border border-yellow-500/50">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm mr-3">
              B
            </div>
            <div>
              <div className="text-sm font-medium">Big McDonalds</div>
              <div className="text-xs text-gray-500">13th/03/2027</div>
            </div>
            <ChevronDown className="w-4 h-4 text-yellow-500 ml-3" />
          </div>
        </div>

        {/* Market Overview */}
        <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <h2 className="text-xl md:text-2xl font-semibold text-yellow-500 mb-4 md:mb-6">
            Market Overview
          </h2>

          {/* Cards Section */}
          {loading ? (
            <div className="text-yellow-400 text-center py-8">Loading market data...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {coins.map((coin) => (
              <div key={coin.rank} className="bg-black border border-yellow-500 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  {coin.logo && <img src={coin.logo} alt={coin.name} className="w-6 h-6 mr-2" />}
                  <span className="text-sm text-gray-400">{coin.name}</span>
                </div>
                <div className="text-xl font-bold">{coin.price}</div>
                <div className={`text-sm ${coin.change24h.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {coin.change24h}
                </div>
              </div>
                ))}
              </div>

              {/* Table Section */}
              <div className="bg-black border border-yellow-500 rounded-xl overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-yellow-500 text-left">
                  <th className="p-3 text-base md:text-lg font-bold">#</th>
                  <th className="p-3 text-base md:text-lg font-bold">Coin</th>
                  <th className="p-3 text-base md:text-lg font-bold">Price</th>
                  <th className="p-3 text-base md:text-lg font-bold">24h</th>
                  <th className="p-3 text-base md:text-lg font-bold">Market Cap</th>
                  <th className="p-3 text-base md:text-lg font-bold">Volume</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((coin) => (
                  <tr key={coin.rank} className="hover:bg-gray-900/50 transition text-sm md:text-base">
                    <td className="p-3 text-yellow-500 font-bold">{coin.rank}</td>
                    <td className="p-3 flex items-center gap-3">
                      {coin.logo ? (
                        <img src={coin.logo} alt={coin.name} className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 bg-gray-700 rounded-full" />
                      )}
                      <div>
                        <div className="font-semibold">{coin.name}</div>
                        {coin.symbol && <div className="text-xs text-gray-500">{coin.symbol}</div>}
                      </div>
                    </td>
                    <td className="p-3 font-medium">{coin.price}</td>
                    <td
                      className={`p-3 text-sm ${
                        coin.change24h.startsWith('+') ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {coin.change24h}
                    </td>
                    <td className="p-3 text-gray-300">{coin.marketCap}</td>
                    <td className="p-3 text-gray-300">{coin.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-16px);
          }
        }
      `}</style>
    </div>
  );
}
