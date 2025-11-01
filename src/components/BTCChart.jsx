import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { api } from '../services/api';

const BTCChart = () => {
  const [chartData, setChartData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState('68,320.00');
  const [priceChange, setPriceChange] = useState('+27.8%');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('1D');
  const timeTabs = ['1H', 'all', '1D', '1W', '1M'];

  useEffect(() => {
    fetchChartData();
    fetchCurrentPrice();
    
    // Refresh price every 30 seconds
    const priceInterval = setInterval(fetchCurrentPrice, 30000);
    
    return () => clearInterval(priceInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchCurrentPrice = async () => {
    try {
      const response = await api.getPrice('btc');
      if (response.priceUSD) {
        const price = response.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        setCurrentPrice(price);
      }
    } catch (error) {
      console.error('Error fetching BTC price:', error);
    }
  };

  const fetchChartData = async () => {
    setLoading(true);
    try {
      let days = 7; // Default to 1 week
      if (activeTab === '1D') days = 1;
      else if (activeTab === '1W') days = 7;
      else if (activeTab === '1M') days = 30;
      else if (activeTab === '1H') days = 1;
      else if (activeTab === 'all') days = 365;

      const response = await api.getMarketChart('btc', days);
      
      if (response.prices && Array.isArray(response.prices)) {
        const formatted = response.prices.map((item) => ({
          time: '',
          price: item.price || 0
        }));
        
        // Calculate price change
        if (formatted.length > 1) {
          const firstPrice = formatted[0].price;
          const lastPrice = formatted[formatted.length - 1].price;
          const change = ((lastPrice - firstPrice) / firstPrice) * 100;
          const changePercent = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
          setPriceChange(changePercent);
        }
        
        setChartData(formatted);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Fallback to empty data on error
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate chart domain dynamically
  const prices = chartData.map(d => d.price).filter(p => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) * 0.95 : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) * 1.05 : 100000;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-black border border-gray-700 rounded-none p-4 shadow-[0_0_20px_rgba(250,204,21,0.05)] flex flex-col font-poppins">
      
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h2 className="text-white text-3xl font-bold tracking-wide">BTC = ${currentPrice}</h2>
          <div className="flex items-center gap-1">
            <span className={`font-semibold text-base ${priceChange.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange}
            </span>
          </div>
        </div>

        
        <div className="flex gap-4">
          {timeTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`text-sm uppercase tracking-wide px-2 py-0.5 rounded-sm transition-colors ${
                tab === activeTab
                  ? 'text-black bg-yellow-400'
                  : 'text-yellow-400 hover:text-black hover:bg-yellow-400/80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

   
      <div className="relative overflow-hidden">
        {loading ? (
          <div className="h-[220px] flex items-center justify-center text-yellow-400">
            Loading chart data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={chartData.length > 0 ? chartData : [{ time: '', price: 0 }]}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
            <defs>
              <linearGradient id="btcChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#facc15" stopOpacity={0.45} />
                <stop offset="35%" stopColor="#facc15" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#facc15" stopOpacity={0} />
              </linearGradient>
            
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="btcStripes" width="3" height="400" patternUnits="userSpaceOnUse">
                <rect width="1" height="400" fill="rgba(250,204,21,0.22)" />
              </pattern>
              <linearGradient id="verticalFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                <stop offset="45%" stopColor="#ffffff" stopOpacity="0.18" />
                <stop offset="70%" stopColor="#ffffff" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <mask id="stripesMask">
                <rect x="0" y="0" width="100%" height="100%" fill="url(#verticalFade)" />
              </mask>
            </defs>

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={false}
              interval={0}
            />

            <YAxis
              domain={[minPrice, maxPrice]}
              hide={true}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#000000',
                border: '1px solid #facc15',
                borderRadius: '8px',
                color: '#facc15',
                fontSize: '12px'
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
              labelFormatter={(label) => `Point: ${label}`}
              labelStyle={{ color: '#facc15' }}
            />

            <Area
              type="linear"
              dataKey="price"
              stroke="#facc15"
              strokeWidth={3}
              fill="url(#btcChartFill)"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              connectNulls={true}
              strokeLinejoin="round"
              strokeLinecap="round"
              className="[filter:url(#glow)]"
            />
            <g mask="url(#stripesMask)">
              <Area
                type="linear"
                dataKey="price"
                stroke="none"
                fill="url(#btcStripes)"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
                connectNulls={true}
              />
            </g>
          </AreaChart>
        </ResponsiveContainer>
        )}

        <div
          className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))'
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-yellow-500/80 mt-2 px-1">
        <span>08:01</span>
        <span>18:00</span>
        <span>20:00</span>
        <span>08:00</span>
        <span>18:40</span>
        <span>10:40</span>
      </div>
    </div>
  );
};

export default BTCChart;