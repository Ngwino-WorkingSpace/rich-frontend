import { useState, useEffect } from "react";
import assets from "../assets/assets";
import { useWeb3 } from "../contexts/Web3Context";
import { api } from "../services/api";
import { ethers } from "ethers";

const WalletCard = () => {
  const { account, provider } = useWeb3();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account) {
      fetchWalletData();
    } else {
      setLoading(false);
    }
  }, [account, provider]);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const walletData = [];
      let total = 0;

      // Fetch ETH balance
      if (provider && account) {
        try {
          const ethBalance = await provider.getBalance(account);
          const ethAmount = parseFloat(ethers.formatEther(ethBalance));
          
          if (ethAmount > 0) {
            const ethPriceResponse = await api.getPrice('ETH'); // Backend expects uppercase
            const ethPrice = ethPriceResponse.priceUSD || 2700;
            const ethValue = ethAmount * ethPrice;
            
            walletData.push({
              id: 1,
              name: "ETH",
              amount: ethValue,
              color: "bg-blue-500"
            });
            total += ethValue;
          }
        } catch (error) {
          console.error('Error fetching ETH balance:', error);
        }
      }

      // Fetch user pools to calculate BTC and other investments
      if (account) {
        try {
          const userResponse = await api.getUser(account);
          const pools = userResponse.user?.joinedPools || [];
          
          // Get BTC price
          const btcPriceResponse = await api.getPrice('BTC'); // Backend expects uppercase
          const btcPrice = btcPriceResponse.priceUSD || 68350;
          
          // Group by coin type
          const coinGroups = {};
          pools.forEach(pool => {
            const coinType = pool.coinType || 'BTC';
            const contribution = parseFloat(pool.userContribution || pool.amount || 0);
            
            if (contribution > 0) {
              if (!coinGroups[coinType]) {
                coinGroups[coinType] = 0;
              }
              coinGroups[coinType] += contribution;
            }
          });
          
          // Convert to wallet format
          Object.entries(coinGroups).forEach(([coinType, amount], index) => {
            const colors = {
              'BTC': 'bg-orange-500',
              'ETH': 'bg-blue-500',
              'USDC': 'bg-blue-400',
              'USDT': 'bg-green-500'
            };
            
            walletData.push({
              id: walletData.length + 1,
              name: coinType,
              amount: amount,
              color: colors[coinType] || 'bg-purple-500'
            });
            total += amount;
          });
        } catch (error) {
          console.error('Error fetching user pools:', error);
        }
      }

      // If no wallets, show empty state
      if (walletData.length === 0) {
        walletData.push({
          id: 1,
          name: "No Assets",
          amount: 0,
          color: "bg-gray-500"
        });
      }

      setWallets(walletData);
      setTotalBalance(total);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleWalletHover = (wallet) => {
    setSelectedWallet(wallet.id === selectedWallet ? null : wallet.id);
  };

  const getWalletColorVariant = (color) => {
    const variants = {
      "bg-orange-500": "hover:bg-orange-400",
      "bg-blue-500": "hover:bg-blue-400",
      "bg-green-500": "hover:bg-green-400",
      "bg-blue-400": "hover:bg-blue-300",
      "bg-purple-500": "hover:bg-purple-400",
    };
    return variants[color] || "hover:bg-accent/20";
  };

  return (
    <>
      <div className="bg-card border-3 border-[#f5c755] rounded-2xl p-4 sm:p-6 relative group overflow-hidden
                      transform transition-all duration-700 ease-out
                      hover:scale-[1.02] ">
     
        {selectedWallet && (
          <div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-30 bg-[#f5c755] text-accent-foreground border border-border rounded-md sm:rounded-lg p-1 sm:p-2 shadow-lg transition-all duration-300 text-xs animate-pulse-subtle">
            Selected: {wallets.find(w => w.id === selectedWallet)?.name}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 relative z-10 transition-all duration-300 group-hover:translate-x-1">
          <div className="w-full sm:w-auto mb-3 sm:mb-0">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 transition-colors duration-300 group-hover:text-[#f5c755]">
              Wallet
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground transition-colors duration-300 group-hover:text-[#f5c755]">
              Balance money: <span className="text-[#f5c755] font-medium transition-colors duration-300 group-hover:text-accent-foreground">
                {loading ? 'Loading...' : formatAmount(totalBalance)}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3  sm:mb-6 relative z-10">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              onMouseEnter={() => handleWalletHover(wallet)}
              onMouseLeave={() => handleWalletHover(null)}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3 border-b border-border/50 last:border-0 rounded-lg p-2 transition-all duration-300 ease-out hover:bg-muted/50 hover:scale-[1.02] hover:shadow-sm group/item ${
                selectedWallet === wallet.id ? "bg-[#f5c755]/10 border-l-4 border-[#f5c755]" : ""
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full sm:w-auto  sm:mb-0">
                <div className={`${wallet.color} ${getWalletColorVariant(wallet.color)} w-6 sm:w-8 h-6 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover/item:scale-110 hover:shadow-lg`}>
                  <span className="text-[10px] sm:text-xs font-bold text-white transition-transform duration-300 group-hover/item:scale-110">
                    {wallet.name.slice(0, 1)}
                  </span>
                </div>
                <span className={`text-xs text-left sm:text-sm font-medium text-foreground transition-all duration-300 flex-1 min-w-0 truncate ${
                  selectedWallet === wallet.id ? "text-[#f5c755] font-bold" : "group-hover/item:text-[#f5c755]"
                }`}>
                  {wallet.name}
                </span>
              </div>
              <span className={`text-xs sm:text-sm font-medium transition-all duration-300 ${
                selectedWallet === wallet.id ? "text-[#f5c755] font-bold" : "text-[#f5c755] group-hover/item:text-accent-foreground"
              }`}>
                {formatAmount(wallet.amount)}
              </span>
            </div>
          ))}
        </div>

        
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5c755]/5 to-muted/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-2xl pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#f5c755]/5 to-transparent opacity-50"></div>
        </div>
      </div>
      <div className="flex justify-center sm:mt-8">
        <img 
          src={assets.GoldBars} 
          alt="Gold Bars" 
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-60 lg:h-60 object-contain transition-all duration-500 hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-[#f5c755]/20" 
        />
      </div>
    </>
  );
};

export default WalletCard;