import { ethers } from 'ethers';

/**
 * Get ETH balance for an address
 * @param {ethers.Provider} provider - Ethers provider
 * @param {string} address - Wallet address
 * @returns {Promise<string>} Balance in ETH as string
 */
export const getBalance = async (provider, address) => {
  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
};

/**
 * Estimate gas cost for a transaction
 * @param {ethers.Contract} contract - Contract instance
 * @param {string} methodName - Method name
 * @param {array} args - Method arguments
 * @returns {Promise<object>} Gas estimate
 */
export const estimateGas = async (contract, methodName, args, value = null) => {
  try {
    const estimate = await contract[methodName].estimateGas(...args, value ? { value } : {});
    return estimate;
  } catch (error) {
    console.error('Error estimating gas:', error);
    throw error;
  }
};

/**
 * Check if user has sufficient balance for transaction
 * @param {ethers.Provider} provider - Ethers provider
 * @param {string} address - Wallet address
 * @param {string} amountEth - Amount in ETH (as string)
 * @param {bigint} gasEstimate - Gas estimate in wei
 * @returns {Promise<{sufficient: boolean, balance: string, needed: string, shortfall: string}>}
 */
export const checkSufficientBalance = async (provider, address, amountEth, gasEstimate = null) => {
  try {
    const balance = await provider.getBalance(address);
    const balanceEth = ethers.formatEther(balance);
    const amountWei = ethers.parseEther(amountEth);
    
    // If gas estimate provided, use it; otherwise estimate 0.01 ETH for gas
    const gasCost = gasEstimate || ethers.parseEther('0.01');
    const totalNeeded = amountWei + gasCost;
    const totalNeededEth = ethers.formatEther(totalNeeded);
    
    const sufficient = balance >= totalNeeded;
    const shortfall = sufficient ? '0' : ethers.formatEther(totalNeeded - balance);
    
    return {
      sufficient,
      balance: balanceEth,
      needed: totalNeededEth,
      shortfall: shortfall,
      gasEstimate: ethers.formatEther(gasCost)
    };
  } catch (error) {
    console.error('Error checking balance:', error);
    throw error;
  }
};

