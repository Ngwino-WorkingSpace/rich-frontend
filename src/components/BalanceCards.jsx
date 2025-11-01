import { useState, useEffect } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { api } from "../services/api";
import { ethers } from "ethers";
import assets from "../assets/assets";

const circumference = 2 * Math.PI * 40;
const seg = circumference / 3;

const BalanceCard = () => {
  const { account, provider } = useWeb3();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cryptos, setCryptos] = useState([
    { name: "0%", image: assets.Icon3, id: "btc", amount: 0 },
    { name: "0%", image: assets.Icon2, id: "eth", amount: 0 },
    { name: "0%", image: assets.Icon1, id: "usdc", amount: 0 },
  ]);
  const [hoveredCrypto, setHoveredCrypto] = useState(null);

  useEffect(() => {
    if (account) {
      fetchBalanceData();
    } else {
      setLoading(false);
    }
  }, [account, provider]);

  const fetchBalanceData = async () => {
    setLoading(true);
    try {
      let totalUSD = 0;
      const cryptoData = [];

      // Fetch ETH balance
      if (provider && account) {
        try {
          const ethBalance = await provider.getBalance(account);
          const ethAmount = parseFloat(ethers.formatEther(ethBalance));
          
          // Fetch ETH price
          const ethPriceResponse = await api.getPrice('ETH'); // Backend expects uppercase
          const ethPrice = ethPriceResponse.priceUSD || 2700;
          const ethValue = ethAmount * ethPrice;
          
          if (ethValue > 0) {
            cryptoData.push({
              name: `${ethAmount.toFixed(4)} ETH`,
              image: assets.Icon2,
              id: "eth",
              amount: ethValue
            });
            totalUSD += ethValue;
          }
        } catch (error) {
          console.error('Error fetching ETH balance:', error);
        }
      }

      // Fetch user pools and calculate BTC investments
      if (account) {
        try {
          const userResponse = await api.getUser(account);
          const pools = userResponse.user?.joinedPools || [];
          
          // Fetch BTC price
          const btcPriceResponse = await api.getPrice('BTC'); // Backend expects uppercase
          const btcPrice = btcPriceResponse.priceUSD || 68350;
          
          let totalBTCValue = 0;
          pools.forEach(pool => {
            if (pool.coinType === 'BTC' && pool.userContribution) {
              totalBTCValue += parseFloat(pool.userContribution) || 0;
            }
          });
          
          if (totalBTCValue > 0) {
            cryptoData.push({
              name: `${(totalBTCValue / btcPrice).toFixed(4)} BTC`,
              image: assets.Icon3,
              id: "btc",
              amount: totalBTCValue
            });
            totalUSD += totalBTCValue;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }

      // Calculate percentages and format
      const formattedCryptos = cryptoData.map(crypto => ({
        ...crypto,
        name: totalUSD > 0 ? `${((crypto.amount / totalUSD) * 100).toFixed(0)}%` : "0%"
      }));

      // If no data, show placeholder
      if (formattedCryptos.length === 0) {
        formattedCryptos.push(
          { name: "0%", image: assets.Icon3, id: "btc", amount: 0 },
          { name: "0%", image: assets.Icon2, id: "eth", amount: 0 },
          { name: "0%", image: assets.Icon1, id: "usdc", amount: 0 }
        );
      }

      setCryptos(formattedCryptos);
      setBalance(totalUSD);
    } catch (error) {
      console.error('Error fetching balance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const circumferenceChart = 251.2;
  const totalCryptoAmount = cryptos.reduce((sum, c) => sum + c.amount, 0);
  const progress = balance > 0 ? Math.min(totalCryptoAmount / balance, 1) : 0;
  const strokeDashoffset = circumferenceChart * (1 - progress);

  const handleCryptoHover = (id) => setHoveredCrypto(id);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          0% { transform: translateX(20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideInLeft {
          0% { transform: translateX(-20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes rotateSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseSubtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseHover {
          0% { box-shadow: 0 0 0 0 rgba(255, 184, 3, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 184, 3, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 184, 3, 0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.5s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.5s ease-out forwards; }
        .animate-rotate-slow { animation: rotateSlow 20s linear infinite; }
        .animate-pulse-subtle { animation: pulseSubtle 2s infinite; }
        .animate-bounce-subtle { animation: bounceSubtle 1.5s infinite; }
        .animate-wiggle { animation: wiggle 1s ease-in-out infinite; }
        .animate-spin-slow { animation: spinSlow 2s linear infinite; }
        .animate-pulse-hover { animation: pulseHover 1.5s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .hover\\:animate-spin-slow:hover { animation: spinSlow 2s linear infinite; }
        .group-hover\\:animate-pulse-subtle:hover .group:hover & { animation: pulseSubtle 2s infinite; }
        .group-hover\\:animate-bounce-subtle:hover .group:hover & { animation: bounceSubtle 1.5s infinite; }
        .group-hover\\:animate-spin-slow:hover .group:hover & { animation: spinSlow 2s linear infinite; }
      `}</style>
      <div
        className="bg-black flex flex-col sm:flex-row justify-between min-h-[16rem] sm:h-[16rem] rounded-2xl p-4 sm:p-6 relative group
        border-[#FFB803] border-3
        transform transition-all duration-700 ease-out
        hover:scale-[1.02] hover:shadow-2xl 
        animate-pulse-subtle"
      >
      
        <div className="grid items-start justify-between flex-1 w-full sm:w-auto mb-4 sm:mb-0 animate-fade-in-up">
          <div className="text-center sm:text-left">
            <p className="text-base sm:text-lg text-muted-foreground mb-2 animate-slide-in-right delay-100">
              Total Balance
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-accent group-hover:text-accent-foreground transition-all duration-500 ease-out animate-scale-in delay-200">
              {loading ? 'Loading...' : `$${balance.toFixed(2)}`}
            </h2>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 mt-3 sm:mt-4 animate-slide-in-left delay-300">
      
            <button
              className="w-8 sm:w-10 h-8 sm:h-10 bg-secondary border border-border rounded-lg 
                         flex items-center justify-center hover:bg-muted transition-all duration-300 ease-out 
                         hover:scale-110 hover:rotate-12 group-hover:animate-bounce-subtle flex-1 sm:flex-none
                         animate-pulse-hover"
              onClick={fetchBalanceData}
            >
              <img
                src={assets.Refresh}
                alt="Refresh"
                className="w-4 sm:w-5 h-4 sm:h-5 object-contain transition-transform duration-500 hover:animate-spin-slow"
              />
            </button>

           
            <button
              className="w-8 sm:w-10 h-8 sm:h-10 bg-secondary border border-border rounded-lg 
                         flex items-center justify-center hover:bg-muted transition-all duration-300 ease-out 
                         hover:scale-110 hover:-translate-y-1 group-hover:animate-pulse-subtle flex-1 sm:flex-none
                         animate-wiggle"
            >
              <img
                src={assets.Download}
                alt="Download"
                className="w-4 sm:w-5 h-4 sm:h-5 object-contain transition-transform duration-500 hover:scale-110"
              />
            </button>

       
            <button
              className="w-8 sm:w-10 h-8 sm:h-10 bg-secondary border border-border rounded-lg 
                         flex items-center justify-center hover:bg-muted transition-all duration-300 ease-out 
                         hover:scale-110 hover:translate-y-1 group-hover:animate-bounce-subtle flex-1 sm:flex-none
                         animate-wiggle delay-100"
            >
              <img
                src={assets.Upload}
                alt="Upload"
                className="w-4 sm:w-5 h-4 sm:h-5 object-contain transition-transform duration-500 hover:scale-110"
              />
            </button>

            <button
              className="w-8 sm:w-10 h-8 sm:h-10 bg-secondary border border-border rounded-lg 
                         flex items-center justify-center hover:bg-muted transition-all duration-300 ease-out 
                         hover:scale-110 hover:rotate-180 group-hover:animate-spin-slow flex-1 sm:flex-none
                         animate-pulse-hover delay-200"
            >
              <img
                src={assets.Download}
                alt="More"
                className="w-4 sm:w-5 h-4 sm:h-5 object-contain transition-transform duration-700 ease-in-out"
              />
            </button>
          </div>
        </div>

       
        <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-4 sm:gap-0 sm:ml-6 animate-fade-in-right delay-400">
    
         
<div className="w-24 sm:w-32 h-24 sm:h-32 relative flex-shrink-0 animate-rotate-slow">
  <svg
    viewBox="0 0 100 100"
    className="transform -rotate-90 transition-all duration-1500 ease-out w-full h-full group-hover:animate-pulse-subtle"
  >
    <circle
      cx="50"
      cy="50"
      r="40"
      fill="none"
      stroke="hsl(var(--muted))"
      strokeWidth="8"
      className="opacity-40 transition-all duration-500"
    />
    <circle
      cx="50"
      cy="50"
      r="40"
      fill="none"
      stroke="#23b99f"
      strokeWidth="8"
      strokeDasharray={`${seg} ${circumference - seg}`}
      strokeDashoffset={0}
      strokeLinecap="round"
    />
    <circle
      cx="50"
      cy="50"
      r="40"
      fill="none"
      stroke="#fcc61c"
      strokeWidth="8"
      strokeDasharray={`${seg} ${circumference - seg}`}
      strokeDashoffset={seg}
      strokeLinecap="round"
    />
    <circle
      cx="50"
      cy="50"
      r="40"
      fill="none"
      stroke="#2872f8"
      strokeWidth="8"
      strokeDasharray={`${seg} ${circumference - seg}`}
      strokeDashoffset={2 * seg}
      strokeLinecap="round"
    />
  </svg>
</div>
       
          <div className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm w-full sm:w-auto sm:ml-6 animate-slide-in-up delay-500">
            {cryptos.map((crypto, index) => (
              <div
                key={crypto.id}
                onMouseEnter={() => handleCryptoHover(crypto.id)}
                onMouseLeave={() => handleCryptoHover(null)}
                className={`flex items-center gap-2 sm:gap-3 cursor-pointer p-2 rounded-xl transition-all duration-300 ease-out
                  ${hoveredCrypto === crypto.id ? "bg-muted/50 scale-105 shadow-lg shadow-accent/20" : "hover:bg-muted/30 hover:scale-102"}
                  animate-float delay-${index * 100}`}
              >
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className={`w-4 sm:w-6 h-4 sm:h-6 rounded-full object-contain transition-all duration-300 ease-out ${
                    hoveredCrypto === crypto.id ? "scale-125 rotate-12" : "hover:scale-110"
                  }`}
                />
               <div className="flex items-center justify-between w-full">

  <span
    className={`transition-all duration-300 ease-out ${
      hoveredCrypto === crypto.id
        ? "text-foreground font-semibold translate-x-1"
        : "text-muted-foreground hover:translate-x-1"
    } truncate`}
  >
    {crypto.name}
  </span>

  <div className="border border-yellow-400 text-yellow-300 text-xs px-2 py-0.5 rounded-md font-medium ml-2 transition-all duration-300 hover:bg-yellow-400/10">
    {crypto.id}
  </div>
</div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BalanceCard;