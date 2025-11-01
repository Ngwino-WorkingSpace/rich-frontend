'use client';
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import assets from "../assets/assets";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useWeb3 } from "../contexts/Web3Context";
import { contractService } from "../services/contracts";
import { api } from "../services/api";
import BalanceDisplay from "../components/BalanceDisplay";

const Card = ({ pool, compact = false, onJoin }) => {
  const navigate = useNavigate();
  
  // Format wallet address for display
  const formatAddress = (addr) => {
    if (!addr) return "Unknown";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Check if user has joined (has contribution)
  const hasJoined = pool.userContribution && parseFloat(pool.userContribution) > 0;

  const handleDetails = () => {
    // Use invite link if available, otherwise use contract address
    if (pool.inviteLink) {
      const inviteId = pool.inviteLink.split('/').pop();
      navigate(`/pools/${inviteId}`);
    } else if (pool.contract_address) {
      navigate(`/pool-details/${pool.contract_address}`);
    } else {
      navigate("/pool-details");
    }
  };

  const handleJoin = () => {
    if (onJoin && pool.contract_address) {
      onJoin(pool.contract_address);
    } else {
      navigate("/connect");
    }
  };

  return (
    <div className="rounded-2xl border-2 border-yellow-500/80 bg-black/60 p-5 sm:p-6 md:p-7 shadow-[0_0_20px_rgba(250,204,21,0.08)] text-white font-poppins h-full transition-transform hover:scale-[1.01] duration-200">
      <div className="text-xl sm:text-2xl md:text-3xl font-semibold mb-1">
        {pool.name || `Pool ${pool.contract_address?.slice(0, 8) || 'Unknown'}`}
      </div>
      <div className="text-yellow-400 text-sm sm:text-base md:text-lg mb-3">
        By {formatAddress(pool.creator_wallet || pool.creatorWallet)}
      </div>
      {pool.userContribution && parseFloat(pool.userContribution) > 0 && (
        <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base md:text-lg mb-3">
          <img src={assets.Rich} alt="contribution" className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-semibold text-white">
            Your Contribution: {parseFloat(pool.userContribution).toFixed(4)} ETH
          </span>
        </div>
      )}
      {!compact && (
        <>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4 line-clamp-2">
            {pool.description || pool.desc || "No description available"}
          </p>
          {pool.totalRaised && pool.targetAmount && (
            <div className="mb-3">
              <p className="text-gray-300 text-xs mb-1">
                {parseFloat(pool.totalRaised).toFixed(4)} ETH / {parseFloat(pool.targetAmount).toFixed(4)} ETH
              </p>
              {pool.progress !== undefined && typeof pool.progress === 'number' && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(pool.progress, 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </>
      )}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDetails}
          className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition font-semibold text-sm sm:text-base md:text-lg"
        >
          Details
        </button>
        {!pool.isClosed && !hasJoined && (
          <button
            onClick={handleJoin}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition font-semibold text-sm sm:text-base md:text-lg"
          >
            Join
          </button>
        )}
        {hasJoined && (
          <span className="text-sm text-green-400">Joined</span>
        )}
      </div>
    </div>
  );
};

const PoolPage = () => {
  const navigate = useNavigate();
  const { account, signer, provider, connectWallet } = useWeb3();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [poolsTop, setPoolsTop] = useState([]);
  const [myPools, setMyPools] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch pools from MongoDB (backend) and merge with blockchain data
  const fetchPools = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, fetch pools from MongoDB (backend)
      let dbPools = [];
      try {
        const response = await api.getPools({ status: 'open' });
        dbPools = response.pools || [];
      } catch (dbError) {
        console.warn("Failed to fetch pools from backend, using blockchain only:", dbError);
      }

      // Use provider or signer to read from contract
      const signerOrProvider = signer || provider;
      
      if (!signerOrProvider && !window.ethereum) {
        // If no wallet and no ethereum, just show DB pools without blockchain data
        const poolsWithMetadata = dbPools.map(pool => ({
          ...pool,
          contract_address: pool.contractAddress,
          creator_wallet: pool.creatorWallet,
          name: pool.name,
          description: pool.description,
          coinType: pool.coinType,
          progress: pool.totalRaised && pool.targetAmount 
            ? (pool.totalRaised / pool.targetAmount) * 100 
            : 0,
          userContribution: "0",
          isClosed: pool.status !== 'open',
        }));
        setPoolsTop(poolsWithMetadata);
        setMyPools([]);
        return;
      }

      // Create a read-only provider if needed
      const readProvider = signerOrProvider || new ethers.BrowserProvider(window.ethereum);
      
      // Get all pool addresses from blockchain
      let blockchainPools = [];
      try {
        const poolAddresses = await contractService.getAllPools(readProvider);
        
        // Fetch blockchain details for each pool
        blockchainPools = await Promise.all(
          poolAddresses.map(async (addr) => {
            try {
              const details = await contractService.getPoolDetails(
                addr,
                readProvider,
                account
              );
              
              return {
                contract_address: addr,
                totalRaised: ethers.formatEther(details.totalRaised || "0"),
                targetAmount: ethers.formatEther(details.targetAmount || "0"),
                isClosed: details.isClosed || false,
                creator_wallet: details.owner || "",
                userContribution: account ? ethers.formatEther(details.userContribution || "0") : "0",
                progress: details.progress || 0,
              };
            } catch (err) {
              console.error(`Error fetching pool ${addr}:`, err);
              return null;
            }
          })
        );
        blockchainPools = blockchainPools.filter(p => p !== null);
      } catch (blockchainError) {
        console.warn("Failed to fetch pools from blockchain:", blockchainError);
      }

      // Merge DB pools with blockchain data
      const mergedPools = dbPools.map(dbPool => {
        const contractAddr = dbPool.contractAddress?.toLowerCase();
        const blockchainData = blockchainPools.find(
          bp => bp.contract_address?.toLowerCase() === contractAddr
        );

        return {
          ...dbPool,
          contract_address: contractAddr,
          creator_wallet: dbPool.creatorWallet,
          name: dbPool.name,
          description: dbPool.description,
          coinType: dbPool.coinType,
          // Use blockchain data if available, otherwise use DB data
          totalRaised: blockchainData?.totalRaised || dbPool.totalRaised?.toString() || "0",
          targetAmount: blockchainData?.targetAmount || dbPool.targetAmount?.toString() || "0",
          progress: blockchainData?.progress || (dbPool.totalRaised && dbPool.targetAmount 
            ? (dbPool.totalRaised / dbPool.targetAmount) * 100 
            : 0),
          userContribution: blockchainData?.userContribution || "0",
          isClosed: blockchainData?.isClosed || dbPool.status !== 'open',
          inviteLink: dbPool.inviteLink,
        };
      });

      // Add any blockchain pools not in DB (legacy pools)
      const dbAddresses = new Set(dbPools.map(p => p.contractAddress?.toLowerCase()));
      const orphanPools = blockchainPools
        .filter(bp => !dbAddresses.has(bp.contract_address?.toLowerCase()))
        .map(bp => ({
          ...bp,
          name: `Pool ${bp.contract_address.slice(0, 8)}`,
          description: "",
          coinType: "BTC",
          inviteLink: null,
        }));

      const allPools = [...mergedPools, ...orphanPools];
      setPoolsTop(allPools);
      setMyPools(allPools.filter((p) => parseFloat(p.userContribution || "0") > 0));
    } catch (err) {
      console.error("Failed to fetch pools:", err);
      setError(err.message || "Failed to fetch pools");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, [account, provider]);

  const handleJoin = async (poolAddress) => {
    if (!account || !signer) {
      try {
        await connectWallet();
        setError("Please try joining again after connecting your wallet");
      } catch (err) {
        setError("Failed to connect wallet");
      }
      return;
    }

    try {
      // Check balance first
      const balance = await provider.getBalance(account);
      const balanceEth = parseFloat(ethers.formatEther(balance));
      
      // Ask user for contribution amount
      const amountEth = prompt(
        `Enter contribution amount in ETH.\n\nYour balance: ${balanceEth.toFixed(6)} ETH\nRecommended: Leave some ETH for gas fees (~0.01-0.02 ETH)`,
        '0.025'
      );
      
      if (!amountEth || parseFloat(amountEth) <= 0) {
        setError("Invalid amount or cancelled");
        return;
      }
      
      const amount = parseFloat(amountEth);
      
      // Check if user has enough balance (amount + gas)
      const gasBuffer = 0.02; // Reserve 0.02 ETH for gas
      if (balanceEth < amount + gasBuffer) {
        const needed = (amount + gasBuffer).toFixed(6);
        const shortfall = (amount + gasBuffer - balanceEth).toFixed(6);
        setError(
          `Insufficient funds!\n\nYou have: ${balanceEth.toFixed(6)} ETH\nYou need: ${needed} ETH (${amount} ETH + ${gasBuffer} ETH gas)\nShortfall: ${shortfall} ETH\n\nPlease add more ETH to your wallet or contribute a smaller amount.`
        );
        return;
      }
      
      const result = await contractService.contributeToPool(poolAddress, signer, amountEth);
      
      alert(`Successfully contributed ${amountEth} ETH! Transaction: ${result.txHash}`);
      fetchPools(); // Refresh pools
      setError(null);
    } catch (err) {
      console.error('Join pool error:', err);
      
      // Better error messages for insufficient funds
      if (err.code === 'INSUFFICIENT_FUNDS' || err.message?.includes('insufficient funds')) {
        const balance = await provider.getBalance(account).catch(() => null);
        const balanceEth = balance ? parseFloat(ethers.formatEther(balance)) : 'unknown';
        setError(
          `Insufficient funds for this transaction.\n\nYour balance: ${balanceEth} ETH\n\nYou need enough ETH to cover:\n- Contribution amount\n- Gas fees (~0.01-0.02 ETH)\n\nPlease add more ETH to your wallet.`
        );
      } else {
        setError(err.message || "Failed to join pool");
      }
    }
  };

  // Format wallet address for display
  const formatAddress = (addr) => {
    if (!addr) return "Guest";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Filter pools based on search query
  const filteredPoolsTop = poolsTop.filter((p) =>
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.contract_address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white font-poppins flex flex-col md:flex-row transition-all duration-300">
      {/* Sidebar (mobile responsive) */}
      <div
        className={`fixed md:static z-30 bg-black border-r border-gray-800 transition-all duration-300 ${
          sidebarOpen ? "left-0" : "-left-64"
        } md:left-0 w-64 h-screen`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Mobile Navbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-7 h-7 text-yellow-500" />
          </button>
          <h1 className="text-xl font-bold italic text-yellow-500">Pools</h1>
        </div>

        {/* Top Bar (Desktop) */}
        <div className="hidden md:flex items-center justify-between px-6 py-5 border-b border-gray-900 w-full">
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-white bg-clip-text text-transparent font-bold text-3xl tracking-wide">
            POOL MANAGEMENT
          </div>
          <div className="flex items-center gap-3">
            <img
              src={assets.profile}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-yellow-600/60"
            />
            <div className="text-right leading-5">
              <div className="text-white text-lg md:text-xl font-semibold">
                {account ? formatAddress(account) : "Guest"}
              </div>
              {account && provider && (
                <BalanceDisplay account={account} provider={provider} />
              )}
            </div>
          </div>
        </div>

        {/* Page Body */}
        <div className="px-4 sm:px-5 md:px-6 py-6 flex-1 flex flex-col">
          {/* Error Message */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/20 border-2 border-red-500 rounded-xl text-red-400 text-center text-sm">
              {error}
            </div>
          )}

          {/* Wallet Connection Prompt */}
          {!account && (
            <div className="mb-4 px-4 py-3 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl text-yellow-400 text-center text-sm">
              <button 
                onClick={async () => {
                  try {
                    await connectWallet();
                    await fetchPools();
                  } catch (err) {
                    setError("Failed to connect wallet");
                  }
                }}
                className="underline hover:no-underline"
              >
                Connect Wallet
              </button> to view and join pools
            </div>
          )}

          {/* Search + CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-auto flex-1">
              <img
                src={assets.Searchimage}
                alt="search"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-80"
              />
              <input
                placeholder="Search a pool name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-2 border-yellow-500/70 rounded-full pl-11 pr-4 py-2.5 sm:py-3 text-yellow-100 placeholder:text-yellow-300/70 outline-none text-sm sm:text-base md:text-lg"
              />
            </div>
            <button 
              onClick={fetchPools}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition font-semibold text-sm sm:text-base md:text-lg"
            >
              Refresh
            </button>
          </div>

          {/* Top Pools */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-4">
            Top Pools
          </h2>
          {isLoading ? (
            <div className="text-center text-yellow-400 text-xl py-10">Loading pools...</div>
          ) : filteredPoolsTop.length === 0 ? (
            <div className="text-center text-gray-400 text-xl py-10">No pools found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 flex-1">
              {filteredPoolsTop.map((p) => (
                <Card key={p.contract_address || p.name} pool={p} onJoin={handleJoin} />
              ))}
            </div>
          )}

          {/* My Pools Header */}
          <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
            <div className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-white bg-clip-text text-transparent font-bold text-2xl md:text-3xl tracking-wide">
              MY POOLS
            </div>
            <button
              onClick={() => navigate("/create-pool")}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-black text-2xl font-bold shadow hover:opacity-90"
              title="Add Pool"
            >
              +
            </button>
          </div>

          {/* My Pools Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 pb-10">
            {myPools.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-6">
                You haven't joined any pools yet. Join a pool to see it here!
              </div>
            ) : (
              myPools.map((p) => (
                <Card key={p.contract_address || p.name} pool={p} compact onJoin={handleJoin} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolPage;
