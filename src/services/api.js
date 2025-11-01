// Try to get API URL from env, with fallback options
const getApiBaseUrl = () => {
  // First try environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Fallback to production
  return 'https://rich-off-chain-backend.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Test API connectivity
 */
const testApiConnection = async () => {
  try {
    // Try a simple OPTIONS or HEAD request first
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(API_BASE_URL.replace('/api', ''), {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors', // This might help with CORS issues
    });
    
    clearTimeout(timeout);
    return true;
  } catch (error) {
    console.warn('API connection test failed:', error);
    return false;
  }
};

/**
 * API service for backend communication
 */
export const api = {
  /**
   * Get current API base URL
   */
  getBaseUrl() {
    return API_BASE_URL;
  },

  /**
   * Test API connection
   */
  testConnection: testApiConnection,

  /**
   * Login/Register user with wallet signature
   * @param {string} wallet - Wallet address
   * @param {string} message - Message that was signed
   * @param {string} signature - Signature from wallet
   * @param {string} username - Optional username
   */
  async login(wallet, message, signature, username = '') {
    const requestPayload = {
      wallet,
      message,
      signature,
      username,
    };

    // Log request details
    console.log('=== API LOGIN REQUEST ===');
    console.log('URL:', `${API_BASE_URL}/user/login`);
    console.log('Method: POST');
    console.log('Payload:', {
      wallet: wallet?.substring(0, 10) + '...',
      messageLength: message?.length,
      signatureLength: signature?.length,
      signaturePreview: signature?.substring(0, 20) + '...',
      username: username || '(empty)'
    });
    console.log('Full signature:', signature);
    console.log('======================');

    try {
      const controller = new AbortController();
      // Increased timeout to 60 seconds for Render.com free tier (can take 30-60s to wake up)
      const timeout = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      clearTimeout(timeout);

      console.log('Response received, status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Login failed';
        let errorDetails = null;
        let responseText = '';
        
        try {
          // Try to get response as text first to see what we're dealing with
          responseText = await response.clone().text();
          console.log('Response text:', responseText.substring(0, 500));
          
          // Then try to parse as JSON
          const error = await response.json();
          console.log('Parsed error response:', error);
          errorMessage = error.error || error.message || errorMessage;
          errorDetails = error.details || error.type;
        } catch (e) {
          console.error('Error parsing response:', e);
          // If response is not JSON, use the text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
          if (responseText && responseText.length < 500) {
            errorMessage += ` - ${responseText}`;
          } else if (responseText) {
            errorMessage += ` - ${responseText.substring(0, 200)}...`;
          }
        }
        
        console.error('Login failed:', {
          status: response.status,
          statusText: response.statusText,
          errorMessage,
          errorDetails,
          responseText: responseText.substring(0, 200)
        });
        
        // Create error with details
        const error = new Error(errorMessage);
        if (errorDetails) error.details = errorDetails;
        error.status = response.status;
        error.responseText = responseText.substring(0, 200);
        throw error;
      }

      const data = await response.json();
      
      // Store user token/wallet for future requests
      if (data.user) {
        localStorage.setItem('userToken', data.user.wallet);
        localStorage.setItem('userData', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      console.error('API URL:', API_BASE_URL);
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after 60 seconds.

The backend server (${API_BASE_URL}) did not respond in time.

Common causes:
1. Server is sleeping (Render.com free tier) - This is normal! The server takes 30-60 seconds to wake up
2. Server is down or restarting
3. Network connectivity issues

Solutions:
• Wait 30-60 seconds and try again (first request to sleeping server takes time)
• Check if server is accessible: Open ${API_BASE_URL.replace('/api', '')} in your browser
• If using localhost, ensure backend is running on port 4000
• Check browser console (F12) for more details`);
      }
      
      // Check if it's actually a server error (status 500) vs network error
      if (error.status === 500) {
        throw new Error(`Server error (500): ${error.message || 'Internal server error. Please try again or contact support.'}`);
      }
      
      if (error.status >= 400 && error.status < 500) {
        // Client error - already has a good message
        throw error;
      }
      
      // Network/fetch errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        // Check if server is actually reachable by looking at the error
        throw new Error(`Network error: Cannot connect to ${API_BASE_URL}. 
        
Possible causes:
1. Server is sleeping (Render free tier - wait 30-60 seconds)
2. Network connectivity issue
3. CORS blocking the request

Try: Check browser console for more details, or verify server is running.`);
      }
      
      // If error already has a message, use it
      if (error.message) {
        throw error;
      }
      
      throw new Error('Failed to connect to server. Please try again later.');
    }
  },

  /**
   * Get user by wallet address
   * @param {string} wallet - Wallet address
   */
  async getUser(wallet) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${API_BASE_URL}/user/${wallet}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get user');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user error:', error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Cannot reach server at ${API_BASE_URL}`);
      }
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {string} wallet - Wallet address
   * @param {object} updates - User updates
   */
  async updateUser(wallet, updates) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${API_BASE_URL}/user/${wallet}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }

      return await response.json();
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  /**
   * Get all pools
   * @param {object} filters - Optional filters (status, creatorWallet)
   */
  async getPools(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.creatorWallet) queryParams.append('creatorWallet', filters.creatorWallet);

      const url = `${API_BASE_URL}/pools${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Failed to fetch pools: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get pools error:', error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Cannot reach server at ${API_BASE_URL}`);
      }
      throw error;
    }
  },

  /**
   * Get pool by address
   * @param {string} address - Pool contract address
   */
  async getPoolByAddress(address) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${API_BASE_URL}/pools/address/${address}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error('Failed to fetch pool');
      }

      return await response.json();
    } catch (error) {
      console.error('Get pool error:', error);
      throw error;
    }
  },

  /**
   * Get pool by invite ID
   * @param {string} inviteId - Pool invite link ID
   */
  async getPoolByInviteId(inviteId) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${API_BASE_URL}/pools/invite/${inviteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error('Failed to fetch pool');
      }

      return await response.json();
    } catch (error) {
      console.error('Get pool by invite error:', error);
      throw error;
    }
  },

  /**
   * Create a new pool
   * @param {object} poolData - Pool creation data
   */
  async createPool(poolData) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${API_BASE_URL}/pools/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: poolData.name,
          description: poolData.description || '',
          coinType: poolData.coinType,
          targetAmount: poolData.targetAmount,
          creatorWallet: poolData.creatorWallet,
          contractAddress: poolData.contractAddress, // Optional, added after on-chain creation
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create pool');
      }

      return await response.json();
    } catch (error) {
      console.error('Create pool error:', error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Cannot reach server at ${API_BASE_URL}`);
      }
      throw error;
    }
  },

  /**
   * Get transaction history for a wallet
   * @param {string} wallet - Wallet address
   */
  async getTransactions(wallet) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${API_BASE_URL}/transactions/${wallet}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch transactions');
      }

      return await response.json();
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    }
  },

  /**
   * Record a new transaction
   * @param {object} txData - Transaction data
   * @param {string} wallet - Wallet address
   * @param {string} message - Auth message
   * @param {string} signature - Auth signature
   */
  async recordTransaction(txData, wallet, message, signature) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${API_BASE_URL}/transactions/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet': wallet,
          'x-msg': message,
          'x-sig': signature,
        },
        body: JSON.stringify({
          wallet: txData.wallet,
          poolContractAddress: txData.poolContractAddress,
          type: txData.type,
          amount: txData.amount,
          txHash: txData.txHash,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to record transaction');
      }

      return await response.json();
    } catch (error) {
      console.error('Record transaction error:', error);
      throw error;
    }
  },

  /**
   * Get live price for a coin
   * @param {string} coin - Coin symbol (BTC, ETH)
   */
  async getPrice(coin) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${API_BASE_URL}/price/${coin}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error('Failed to fetch price');
      }

      return await response.json();
    } catch (error) {
      console.error('Get price error:', error);
      throw error;
    }
  },

  /**
   * Get market chart data
   * @param {string} coin - Coin symbol (BTC, ETH)
   * @param {number} days - Number of days (7 or 30)
   */
  async getMarketChart(coin, days = 7) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${API_BASE_URL}/market/${coin}?days=${days}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }

      return await response.json();
    } catch (error) {
      console.error('Get market chart error:', error);
      throw error;
    }
  },

  /**
   * Send support message
   * @param {object} supportData - Support form data
   */
  async sendSupport(supportData) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${API_BASE_URL}/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: supportData.name,
          email: supportData.email,
          message: supportData.message,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send support message');
      }

      return await response.json();
    } catch (error) {
      console.error('Send support error:', error);
      throw error;
    }
  },
};
