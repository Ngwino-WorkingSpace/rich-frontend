import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { Clock, TrendingUp } from "lucide-react";
import Sidebar from "../components/sidebar";
import assets from "../assets/assets";
import { useWeb3 } from "../contexts/Web3Context";
import { api } from "../services/api";
import { contractService } from "../services/contracts";

const PoolDetails = () => {
  const { address, inviteId } = useParams(); // Support both /pool-details/:address and /pools/:inviteId
  const navigate = useNavigate();
  const { account, signer, provider } = useWeb3();
  
  const [pool, setPool] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pool data from backend and blockchain
  useEffect(() => {
    const fetchPoolData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let poolData = null;

        // Try to fetch from backend first (by invite ID or address)
        if (inviteId) {
          try {
            const response = await api.getPoolByInviteId(inviteId);
            poolData = response.pool;
          } catch (err) {
            console.warn("Failed to fetch pool by invite ID, trying address:", err);
          }
        }

        // If not found by invite, try by address
        if (!poolData && address) {
          try {
            const response = await api.getPoolByAddress(address);
            poolData = response.pool;
          } catch (err) {
            console.warn("Failed to fetch pool by address from backend:", err);
          }
        }

        // If still no pool data, try using inviteId as address
        if (!poolData && inviteId && inviteId.startsWith('0x')) {
          try {
            const response = await api.getPoolByAddress(inviteId);
            poolData = response.pool;
          } catch (err) {
            console.warn("Failed to fetch pool:", err);
          }
        }

        setPool(poolData);

        // Fetch blockchain data if we have a contract address
        const contractAddress = poolData?.contractAddress || address || (inviteId?.startsWith('0x') ? inviteId : null);
        
        if (contractAddress && (provider || window.ethereum)) {
          try {
            const readProvider = provider || new ethers.BrowserProvider(window.ethereum);
            const details = await contractService.getPoolDetails(contractAddress, readProvider, account);
            
            setBlockchainData({
              totalRaised: ethers.formatEther(details.totalRaised || "0"),
              targetAmount: ethers.formatEther(details.targetAmount || "0"),
              progress: details.progress || 0,
              isClosed: details.isClosed || false,
              userContribution: account ? ethers.formatEther(details.userContribution || "0") : "0",
              owner: details.owner || poolData?.creatorWallet || "",
            });
          } catch (blockchainError) {
            console.warn("Failed to fetch blockchain data:", blockchainError);
          }
        }
      } catch (err) {
        console.error("Error fetching pool data:", err);
        setError(err.message || "Failed to load pool details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoolData();
  }, [address, inviteId, account, provider]);

  if (isLoading) {
    return (
      <div className="flex w-screen bg-black text-white font-poppins">
        <div className="w-64 bg-[#0a0a0a] border-r border-yellow-500/30">
          <Sidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-yellow-500 text-xl">Loading pool details...</div>
        </div>
      </div>
    );
  }

  if (error || !pool) {
    return (
      <div className="flex w-screen bg-black text-white font-poppins">
        <div className="w-64 bg-[#0a0a0a] border-r border-yellow-500/30">
          <Sidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">{error || "Pool not found"}</div>
            <button
              onClick={() => navigate("/pool")}
              className="px-6 py-3 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition rounded-xl"
            >
              Back to Pools
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Merge backend and blockchain data
  const displayData = {
    name: pool.name || "Unnamed Pool",
    description: pool.description || "No description available",
    creatorWallet: blockchainData?.owner || pool.creatorWallet || "Unknown",
    coinType: pool.coinType || "BTC",
    lockPeriodYears: pool.lockPeriodYears || 1,
    totalRaised: blockchainData?.totalRaised || pool.totalRaised?.toString() || "0",
    targetAmount: blockchainData?.targetAmount || pool.targetAmount?.toString() || "0",
    progress: blockchainData?.progress || (pool.totalRaised && pool.targetAmount 
      ? (pool.totalRaised / pool.targetAmount) * 100 
      : 0),
    userContribution: blockchainData?.userContribution || "0",
    isClosed: blockchainData?.isClosed || pool.status !== 'open',
    contractAddress: pool.contractAddress || address || inviteId,
    inviteLink: pool.inviteLink,
  };

  // Format wallet address for display
  const formatAddress = (addr) => {
    if (!addr) return "Unknown";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex w-screen bg-black text-white font-poppins">
      {/* Sidebar on the left */}
      <div className="w-64 bg-[#0a0a0a] border-r border-yellow-500/30 animate-slideInLeft">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full bg-[#000] shadow-lg md:p-10 p-5 overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-0 animate-slideInDown">
            <h2 className="text-2xl font-semibold text-yellow-500 ml-3 transition-all duration-500 hover:scale-105">
              POOL DETAILS
            </h2>
          </div>

          <div className="flex items-center gap-3 animate-slideInDown delay-200">
            <img
              src={assets.Rich}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-yellow-500 transition-transform duration-300 hover:rotate-12 hover:scale-110"
            />
            <div className="text-sm text-left transition-opacity duration-500 hover:opacity-80">
              <p className="font-semibold">{account ? formatAddress(account) : "Guest"}</p>
              <p className="text-gray-400 text-xs">{formatDate(pool.createdAt)}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-yellow-500/30 my-4 transition-all duration-700 hover:bg-yellow-500/10"></div>

        {/* Pool Description */}
        <div className="mb-8 animate-slideInUp delay-300">
          <h1 className="text-3xl font-bold text-yellow-500 mb-3 text-start transition-all duration-500">
            {displayData.name}
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl text-left transition-opacity duration-600 hover:opacity-90">
            {displayData.description}
          </p>
          {displayData.inviteLink && (
            <div className="mt-4 p-3 bg-black/60 border border-yellow-500/40 rounded-lg">
              <p className="text-yellow-400 text-sm mb-1">Invite Link:</p>
              <p className="text-gray-300 text-xs break-all">{displayData.inviteLink}</p>
            </div>
          )}
        </div>

        {/* Pool Stats Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-12 animate-slideInUp delay-400">
          {/* Left Column: Vertically stacked info */}
          <div className="flex flex-col gap-4 w-full lg:w-1/3">
            <p className="flex items-center justify-start text-sm sm:text-base transition-all duration-300 hover:translate-x-2">
              <span className="text-yellow-400 font-bold text-base mr-2">Creator:</span>
              <span className="font-semibold text-white">{formatAddress(displayData.creatorWallet)}</span>
            </p>

            <p className="flex items-center justify-start text-sm sm:text-base transition-all duration-300 hover:translate-x-2 delay-100">
              <span className="text-yellow-400 font-bold text-base mr-2">Total Stake: </span>
              <span className="font-semibold text-white">
                {parseFloat(displayData.totalRaised).toFixed(4)} ETH / {parseFloat(displayData.targetAmount).toFixed(4)} ETH
              </span>
            </p>
            
            {displayData.userContribution && parseFloat(displayData.userContribution) > 0 && (
              <p className="flex items-center justify-start text-sm sm:text-base transition-all duration-300 hover:translate-x-2 delay-200">
                <span className="text-yellow-400 font-bold text-base mr-2">Your Contribution: </span>
                <span className="font-semibold text-white">{parseFloat(displayData.userContribution).toFixed(4)} ETH</span>
              </p>
            )}

            {displayData.progress !== undefined && (
              <div className="mt-2">
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div 
                    className="bg-yellow-400 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(displayData.progress, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">{displayData.progress.toFixed(1)}% complete</span>
              </div>
            )}
          </div>

          {/* Right Row: Horizontal stat boxes */}
          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-2/3">
            <div className="flex-1 border border-yellow-500/40 border-2 rounded-xl p-5 text-center transition-all duration-500 hover:scale-105 hover:shadow-lg animate-pulse-slow">
              <p className="text-white-400 text-lg transition-opacity duration-300">Coin type</p>
              <p className="font-semibold mt-1 transition-all duration-300 text-yellow-400">{displayData.coinType}</p>
            </div>

            <div className="flex-1 border border-yellow-500/40 border-2 rounded-xl p-5 text-center transition-all duration-500 hover:scale-105 hover:shadow-lg animate-pulse-slow delay-100">
              <p className="text-white-400 text-lg transition-opacity duration-300">Locking Period</p>
              <p className="font-semibold mt-1 transition-all duration-300 text-yellow-400">
                {displayData.lockPeriodYears} {displayData.lockPeriodYears === 1 ? 'year' : 'years'}
              </p>
            </div>

            <div className="flex-1 border border-yellow-500/40 border-2 rounded-xl p-5 text-center transition-all duration-500 hover:scale-105 hover:shadow-lg animate-pulse-slow delay-200">
              <p className="text-white-400 text-lg transition-opacity duration-300">Status</p>
              <p className="font-semibold mt-1 transition-all duration-300 text-yellow-400 text-md">
                {displayData.isClosed ? 'Closed' : pool.status || 'Open'}
              </p>
            </div>
          </div>
        </div>

        {/* Contract Address */}
        {displayData.contractAddress && (
          <div className="mb-6 p-4 bg-black/60 border border-yellow-500/40 rounded-lg">
            <p className="text-yellow-400 text-sm mb-1">Contract Address:</p>
            <p className="text-gray-300 text-xs break-all font-mono">{displayData.contractAddress}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out forwards;
        }

        @keyframes slideInDown {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideInDown {
          animation: slideInDown 0.6s ease-out forwards;
        }

        @keyframes slideInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideInUp {
          animation: slideInUp 0.7s ease-out forwards;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PoolDetails;
