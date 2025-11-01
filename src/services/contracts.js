import { ethers } from 'ethers';
import PoolFactoryABI from '../web3/abis/PoolFactory.json';
import InvestmentPoolABI from '../web3/abis/InvestmentPool.json';

// Get contract addresses from environment or use defaults
const POOL_FACTORY_ADDRESS = import.meta.env.VITE_POOL_FACTORY_ADDRESS || '0xec0F9d8E2C38B824C5CBB0FB9114eB9499Dc3e93';

/**
 * Contract service for interacting with smart contracts
 */
export const contractService = {
  /**
   * Get PoolFactory contract instance
   * @param {ethers.Signer} signer - Ethers signer
   * @returns {ethers.Contract} PoolFactory contract instance
   */
  getPoolFactory(signer) {
    return new ethers.Contract(POOL_FACTORY_ADDRESS, PoolFactoryABI, signer);
  },

  /**
   * Get InvestmentPool contract instance
   * @param {string} poolAddress - Pool contract address
   * @param {ethers.Signer} signer - Ethers signer
   * @returns {ethers.Contract} InvestmentPool contract instance
   */
  getInvestmentPool(poolAddress, signer) {
    return new ethers.Contract(poolAddress, InvestmentPoolABI, signer);
  },

  /**
   * Create a new pool using PoolFactory
   * @param {ethers.Signer} signer - Ethers signer
   * @param {object} poolData - Pool creation data
   * @param {string} poolData.name - Pool name
   * @param {string} poolData.symbol - Pool token symbol
   * @param {string} poolData.targetAmount - Target amount in ETH (as string)
   * @param {number} poolData.unlockTime - Unlock time as Unix timestamp
   * @param {boolean} poolData.autoBuy - Auto buy enabled
   * @returns {Promise<ethers.ContractTransactionResponse>} Transaction response
   */
  async createPool(signer, poolData) {
    try {
      const factory = this.getPoolFactory(signer);
      
      // Convert target amount to wei (assuming 18 decimals for ETH)
      const targetAmountWei = ethers.parseEther(poolData.targetAmount);
      
      // Convert unlock time if it's in days/years
      let unlockTime;
      if (typeof poolData.unlockTime === 'number') {
        // If it's already a timestamp
        unlockTime = BigInt(Math.floor(poolData.unlockTime));
      } else {
        // Calculate from days/years
        const days = poolData.unlockDays || poolData.lockPeriodYears * 365 || 365;
        unlockTime = BigInt(Math.floor(Date.now() / 1000) + (days * 24 * 60 * 60));
      }

      // ABI shows createPool needs: targetAmount, unlockTime, router, wbtc, name, symbol
      // Get router and wbtc addresses from environment or use defaults
      const router = import.meta.env.VITE_UNISWAP_ROUTER || "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Uniswap V2 Router (Mainnet)
      const wbtc = import.meta.env.VITE_WBTC_ADDRESS || "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"; // WBTC (Mainnet)
      
      // For Sepolia testnet, you might need different addresses
      // Update these based on your deployment network
      const tx = await factory.createPool(
        targetAmountWei,
        unlockTime,
        router,
        wbtc,
        poolData.name,
        poolData.symbol
      );

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Find the PoolCreated event
      const poolCreatedEvent = receipt.logs.find(log => {
        try {
          const parsed = factory.interface.parseLog(log);
          return parsed && parsed.name === 'PoolCreated';
        } catch {
          return false;
        }
      });

      let poolAddress = null;
      if (poolCreatedEvent) {
        const parsed = factory.interface.parseLog(poolCreatedEvent);
        poolAddress = parsed.args.poolAddress;
      }

      return {
        tx,
        receipt,
        poolAddress,
        txHash: receipt.hash,
      };
    } catch (error) {
      console.error('Error creating pool:', error);
      throw error;
    }
  },

  /**
   * Get all pools from PoolFactory
   * @param {ethers.Signer|ethers.Provider} signerOrProvider - Signer or provider
   * @returns {Promise<string[]>} Array of pool addresses
   */
  async getAllPools(signerOrProvider) {
    try {
      const factory = this.getPoolFactory(signerOrProvider);
      const pools = await factory.getPools();
      return pools;
    } catch (error) {
      console.error('Error fetching pools:', error);
      throw error;
    }
  },

  /**
   * Get pool details from on-chain
   * @param {string} poolAddress - Pool contract address
   * @param {ethers.Signer|ethers.Provider} signerOrProvider - Signer or provider
   * @param {string} userAddress - Optional user address to check contributions
   * @returns {Promise<object>} Pool details
   */
  async getPoolDetails(poolAddress, signerOrProvider, userAddress = null) {
    try {
      const pool = this.getInvestmentPool(poolAddress, signerOrProvider);
      
      // Fetch pool data in parallel
      const [
        totalRaised,
        targetAmount,
        unlockTime,
        isClosed,
        owner,
        poolToken,
      ] = await Promise.all([
        pool.totalRaised(),
        pool.targetAmount(),
        pool.unlockTime(),
        pool.isClosed(),
        pool.owner(),
        pool.poolToken(),
      ]);

      // Get user contribution if address provided
      let userContribution = null;
      if (userAddress) {
        try {
          userContribution = await pool.contributions(userAddress);
        } catch {
          userContribution = 0n;
        }
      }

      return {
        address: poolAddress,
        totalRaised: totalRaised.toString(),
        targetAmount: targetAmount.toString(),
        unlockTime: unlockTime.toString(),
        isClosed,
        owner,
        poolToken,
        userContribution: userContribution?.toString() || '0',
        progress: (Number(totalRaised) / Number(targetAmount)) * 100,
      };
    } catch (error) {
      console.error('Error fetching pool details:', error);
      throw error;
    }
  },

  /**
   * Contribute to a pool
   * @param {string} poolAddress - Pool contract address
   * @param {ethers.Signer} signer - Ethers signer
   * @param {string} amountEth - Amount in ETH (as string)
   * @returns {Promise<object>} Transaction response
   */
  async contributeToPool(poolAddress, signer, amountEth) {
    try {
      const pool = this.getInvestmentPool(poolAddress, signer);
      const amountWei = ethers.parseEther(amountEth);
      
      const tx = await pool.contribute({ value: amountWei });
      const receipt = await tx.wait();
      
      return {
        tx,
        receipt,
        txHash: receipt.hash,
      };
    } catch (error) {
      console.error('Error contributing to pool:', error);
      throw error;
    }
  },

  /**
   * Buy WBTC for a pool
   * @param {string} poolAddress - Pool contract address
   * @param {ethers.Signer} signer - Ethers signer
   * @param {object} swapParams - Swap parameters
   * @returns {Promise<object>} Transaction response
   */
  async buyWBTC(poolAddress, signer, swapParams) {
    try {
      const pool = this.getInvestmentPool(poolAddress, signer);
      
      // amountOutMin should be calculated based on slippage tolerance
      // deadline is current time + some buffer (e.g., 20 minutes)
      const deadline = Math.floor(Date.now() / 1000) + 1200;
      
      const tx = await pool.buyWBTC(
        swapParams.amountOutMin || 0n,
        deadline
      );
      
      const receipt = await tx.wait();
      
      return {
        tx,
        receipt,
        txHash: receipt.hash,
      };
    } catch (error) {
      console.error('Error buying WBTC:', error);
      throw error;
    }
  },

  /**
   * Withdraw from a pool
   * @param {string} poolAddress - Pool contract address
   * @param {ethers.Signer} signer - Ethers signer
   * @returns {Promise<object>} Transaction response
   */
  async withdrawFromPool(poolAddress, signer) {
    try {
      const pool = this.getInvestmentPool(poolAddress, signer);
      
      const tx = await pool.withdraw();
      const receipt = await tx.wait();
      
      return {
        tx,
        receipt,
        txHash: receipt.hash,
      };
    } catch (error) {
      console.error('Error withdrawing from pool:', error);
      throw error;
    }
  },
};

