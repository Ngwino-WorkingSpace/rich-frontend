import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context";
import { contractService } from "../services/contracts";
import { api } from "../services/api";

const CreatePool = () => {
  const navigate = useNavigate();
  const { account, signer, connectWallet } = useWeb3();
  
  const [formData, setFormData] = useState({
    name: "",
    coinType: "Bitcoin",
    description: "",
    targetAmount: "",
    minimumEntry: "",
    lockPeriodYears: "1",
    refundPeriod: "1",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreatePool = async () => {
    if (!account || !signer) {
      setError("Please connect your wallet first");
      try {
        await connectWallet();
      } catch (err) {
        setError("Failed to connect wallet");
      }
      return;
    }

    // Validate form
    if (!formData.name || !formData.targetAmount) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert lock period to days and then to timestamp
      const lockPeriodDays = parseInt(formData.lockPeriodYears) * 365;
      const unlockTime = Math.floor(Date.now() / 1000) + (lockPeriodDays * 24 * 60 * 60);

      // Create pool on-chain
      const result = await contractService.createPool(signer, {
        name: formData.name,
        symbol: `${formData.name.substring(0, 4).toUpperCase()}POOL`,
        targetAmount: formData.targetAmount,
        unlockTime,
        autoBuy: false, // Can be made configurable
      });

      // Also create pool record in backend
      let backendResponse = null;
      try {
        backendResponse = await api.createPool({
          name: formData.name,
          coinType: formData.coinType === "Bitcoin" ? "BTC" : formData.coinType,
          targetAmount: parseFloat(formData.targetAmount),
          creatorWallet: account,
          contractAddress: result.poolAddress,
          description: formData.description,
          minContribution: formData.minimumEntry ? parseFloat(formData.minimumEntry) : 1,
          lockPeriodYears: parseInt(formData.lockPeriodYears) || 1,
        });
        
        // Use invite link from backend if available
        const inviteLink = backendResponse?.pool?.inviteLink;
        if (inviteLink) {
          setSuccess(`Pool created successfully! Address: ${result.poolAddress}\nInvite Link: ${inviteLink}`);
        } else {
          setSuccess(`Pool created successfully! Address: ${result.poolAddress}`);
        }
      } catch (backendError) {
        console.warn("Pool created on-chain but backend record failed:", backendError);
        setSuccess(`Pool created on-chain! Address: ${result.poolAddress}\nNote: Backend record creation failed.`);
      }

      // Redirect based on backend response
      if (backendResponse?.pool?.inviteLink) {
        // Extract invite ID from link
        const inviteId = backendResponse.pool.inviteLink.split('/').pop();
        setTimeout(() => {
          navigate(`/pools/${inviteId}`);
        }, 3000);
      } else {
        // Fallback to address-based route
        setTimeout(() => {
          navigate(`/pool-details/${result.poolAddress}`);
        }, 2000);
      }

    } catch (err) {
      console.error("Error creating pool:", err);
      setError(err.message || "Failed to create pool. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center font-poppins bg-black bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url('/src/assets/Pool.png')` }}
    >
      <div className="w-full max-w-[99vw] bg-black/20 rounded-2xl flex flex-col items-center py-12 px-2 sm:px-2 md:px-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-10 tracking-wide font-poppins bg-gradient-to-r from-yellow-400 via-yellow-100 to-white bg-clip-text text-transparent text-center">
          Pool Creation
        </h1>
        <div className="flex flex-col md:flex-row w-full gap-6 md:gap-14 mb-10">
          {/* Pool Overview */}
          <div className="flex-1 border-2 border-yellow-400 rounded-2xl bg-black/60 px-4 md:px-10 py-6 min-w-[95vw] md:min-w-[380px] lg:min-w-[500px] max-w-full shadow-lg font-poppins mb-8 md:mb-0">
            <h2 className="text-yellow-400 text-2xl font-semibold mb-6 font-poppins">Pool Overview</h2>
            <label className="block text-white font-semibold mb-2 text-lg font-poppins">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-black/60 border border-yellow-400 rounded-md px-7 py-3 mb-3 text-yellow-200 placeholder-yellow-200/70 outline-none focus:ring-2 focus:ring-yellow-300 text-lg font-poppins"
              placeholder="My Bitcoin Pool"
            />
            <label className="block text-white font-semibold mb-2 text-lg font-poppins">Coin Type</label>
            <select 
              name="coinType"
              value={formData.coinType}
              onChange={handleInputChange}
              className="w-full bg-black/60 border border-yellow-400 rounded-md px-7 py-3 mb-3 text-yellow-200 outline-none focus:ring-2 focus:ring-yellow-300 text-lg font-poppins"
            >
              <option>Bitcoin</option>
            </select>
            <label className="block text-white font-semibold mb-2 text-lg font-poppins">Pool Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-black/60 border border-yellow-400 rounded-md px-7 py-3 mb-2 text-yellow-200 placeholder-yellow-200/70 outline-none min-h-[60px] focus:ring-2 focus:ring-yellow-300 resize-none text-lg font-poppins"
              placeholder="This pool invests in Bitcoin weekly using auto-buy strategy"
            />
          </div>

          {/* Investment Details */}
          <div className="flex-1 border-2 border-yellow-400 rounded-2xl bg-black/60 px-4 md:px-10 py-6 min-w-[95vw] md:min-w-[380px] lg:min-w-[500px] max-w-full shadow-lg font-poppins">
            <h2 className="text-yellow-400 text-2xl font-semibold mb-6 font-poppins">Investment Details</h2>
            <div className="flex flex-col gap-1 font-poppins">
              <label className="block text-white font-semibold mb-2 text-lg font-poppins">Target Amount (ETH)</label>
              <input
                name="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={handleInputChange}
                className="w-full bg-black/60 border border-yellow-400 rounded-md px-7 py-3 mb-3 text-yellow-200 placeholder-yellow-200/70 outline-none focus:ring-2 focus:ring-yellow-300 text-lg font-poppins"
                placeholder="10.0"
                step="0.01"
              />

              <label className="block text-white font-semibold mb-2 text-lg font-poppins">Minimum Entry (ETH)</label>
              <input
                name="minimumEntry"
                type="number"
                value={formData.minimumEntry}
                onChange={handleInputChange}
                className="w-full bg-black/60 border border-yellow-400 rounded-md px-7 py-3 mb-3 text-yellow-200 placeholder-yellow-200/70 outline-none focus:ring-2 focus:ring-yellow-300 text-lg font-poppins"
                placeholder="0.5"
                step="0.01"
              />

              <label className="block text-white font-semibold mb-2 text-lg font-poppins">Locking Period</label>
              <select 
                name="lockPeriodYears"
                value={formData.lockPeriodYears}
                onChange={handleInputChange}
                className="w-full bg-black/60 border border-yellow-400 rounded-md px-7 py-3 mb-3 text-yellow-200 outline-none focus:ring-2 focus:ring-yellow-300 text-lg font-poppins"
              >
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years</option>
              </select>

            <label className="block text-white font-semibold mb-2 text-lg font-poppins">
                Refund Period
              </label>
              <select 
                name="refundPeriod"
                value={formData.refundPeriod}
                onChange={handleInputChange}
                className="w-full bg-black/60 border border-yellow-400 rounded-md px-7 py-3 mb-3 text-yellow-200 outline-none focus:ring-2 focus:ring-yellow-300 text-lg font-poppins"
              >
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years</option>
              </select>

            </div>
          </div>
        </div>
        <div className="flex flex-col w-full items-center gap-7 mt-2 font-poppins">
          {error && (
            <div className="w-[430px] max-w-[98vw] px-6 py-4 bg-red-500/20 border-2 border-red-500 rounded-2xl text-red-400 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="w-[430px] max-w-[98vw] px-6 py-4 bg-green-500/20 border-2 border-green-500 rounded-2xl text-green-400 text-center">
              {success}
            </div>
          )}
          
          {!account ? (
            <button 
              onClick={async () => {
                try {
                  await connectWallet();
                } catch (err) {
                  setError("Failed to connect wallet");
                }
              }} 
              className="w-[430px] max-w-[98vw] py-5 border-2 border-yellow-400 rounded-2xl font-bold text-2xl text-yellow-400 bg-transparent shadow hover:bg-yellow-400 hover:text-black transition font-poppins"
            >
              Connect Wallet
            </button>
          ) : (
            <>
              <div className="w-[430px] max-w-[98vw] px-6 py-3 bg-green-500/20 border-2 border-green-500 rounded-2xl text-green-400 text-center text-sm">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </div>
              <button 
                onClick={handleCreatePool}
                disabled={isLoading}
                className="w-[430px] max-w-[98vw] py-5 border-2 border-yellow-400 rounded-2xl font-bold text-2xl text-yellow-400 bg-transparent shadow hover:bg-yellow-400 hover:text-black transition font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Pool..." : "Create Pool"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePool;
