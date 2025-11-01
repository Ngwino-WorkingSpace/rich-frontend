/**
 * Helper function to format API errors for user display
 */
export const formatApiError = (error) => {
  if (error.name === 'AbortError' || error.name === 'TimeoutError') {
    return 'Request timeout. Please check your connection and try again.';
  }
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network error. Please check your internet connection or the server may be temporarily unavailable.';
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if API is reachable
 */
export const checkApiHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://rich-off-chain-backend-1.onrender.com/api'}/user/login`, {
      method: 'OPTIONS',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    return false;
  }
};

