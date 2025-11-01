import { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useWeb3 } from "../contexts/Web3Context";
import { api } from "../services/api";

function LoginSignUp() {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { connectWallet, account, signMessage } = useWeb3();

  const toggleForm = () => setIsLogin(!isLogin);

  const generateAuthMessage = (address) => {
    const timestamp = Date.now();
    return `Welcome to RICH!\n\nSign this message to authenticate with your wallet.\n\nWallet: ${address}\nTimestamp: ${timestamp}`;
  };

  const handleWalletAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Connect wallet if not connected
      let walletAddress = account;
      if (!walletAddress) {
        walletAddress = await connectWallet();
      }

      if (!walletAddress) {
        throw new Error('Wallet connection failed. Please try again.');
      }

      // Wake up server first (Render.com free tier can be sleeping)
      try {
        setError("⏳ Waking up server... This may take 30-60 seconds on first request (Render.com free tier).");
        const healthController = new AbortController();
        const healthTimeout = setTimeout(() => healthController.abort(), 15000); // 15 second timeout for health check
        
        const healthCheck = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://rich-off-chain-backend-1.onrender.com/api'}/pools`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: healthController.signal,
        }).catch(() => null); // Ignore health check errors, continue with login
        
        clearTimeout(healthTimeout);
        
        if (healthCheck?.ok) {
          setError(null); // Clear "waking up" message
        }
      } catch (healthError) {
        // Continue with login even if health check fails
        console.log("Health check skipped, proceeding with login...");
      }

      // Generate message to sign
      const message = generateAuthMessage(walletAddress);
      console.log('Generated message:', message);

      // Request signature from wallet
      console.log('Requesting signature from wallet...');
      const signature = await signMessage(message);
      console.log('Signature received:', {
        type: typeof signature,
        length: signature?.length,
        preview: signature?.substring(0, 20) + '...',
        full: signature
      });

      // Validate signature before sending
      if (!signature) {
        throw new Error('No signature received from wallet. Please try signing again.');
      }
      
      if (typeof signature !== 'string') {
        throw new Error(`Invalid signature type: ${typeof signature}. Expected string.`);
      }
      
      if (!signature.startsWith('0x')) {
        throw new Error(`Invalid signature format. Expected hex string starting with 0x. Received: ${signature.substring(0, 50)}`);
      }
      
      if (signature.length < 130) {
        throw new Error(`Invalid signature length. Expected >= 130 characters. Received: ${signature.length}`);
      }

      // Prepare request payload
      const loginPayload = {
        wallet: walletAddress,
        message: message,
        signature: signature,
        username: username || ""
      };

      // Log complete request data for debugging
      console.log('=== LOGIN REQUEST DATA ===');
      console.log('API URL:', import.meta.env.VITE_API_BASE_URL || 'https://rich-off-chain-backend-1.onrender.com/api');
      console.log('Wallet:', walletAddress);
      console.log('Message length:', message.length);
      console.log('Message:', message);
      console.log('Signature:', signature);
      console.log('Signature length:', signature.length);
      console.log('Username:', username || '(empty)');
      console.log('Full payload:', JSON.stringify(loginPayload, null, 2));
      console.log('==========================');

      // Send to backend for verification and login
      const response = await api.login(walletAddress, message, signature, username || "");

      if (response.user) {
        // Success - redirect to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("=== AUTHENTICATION ERROR ===");
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      console.error("Error object:", err);
      console.error("============================");
      
      let errorMessage = err.message || "Failed to authenticate. Please try again.";
      
      // Enhance timeout error messages
      if (errorMessage.includes("timeout") || errorMessage.includes("Request timeout")) {
        errorMessage = `⏱️ Request Timeout

The server took too long to respond (60 seconds).

🔴 If using Render.com free tier:
   • The server sleeps after 15 minutes of inactivity
   • First request takes 30-60 seconds to wake up the server
   • This is NORMAL behavior for free tier

✅ What to do:
   1. Wait 30-60 seconds and click the button again
   2. The server will wake up and respond
   3. Subsequent requests will be faster

💡 Tip: Try accessing the API directly to wake it up:
   ${import.meta.env.VITE_API_BASE_URL || 'https://rich-off-chain-backend-1.onrender.com/api'}/pools

📊 Check browser console (F12) for more details`;
      }
      
      // Check if it's a network error and provide helpful suggestions
      if (errorMessage.includes("Network error") || errorMessage.includes("fetch") || errorMessage.includes("Cannot connect")) {
        errorMessage = `🌐 Connection Failed

Cannot connect to: ${import.meta.env.VITE_API_BASE_URL || 'https://rich-off-chain-backend-1.onrender.com/api'}

Possible causes:
1. Backend server is sleeping (Render free tier) - wait 30-60 seconds
2. Server is down or restarting
3. Network connectivity issue
4. CORS blocking the request

What to do:
• Check browser console (F12) for detailed error
• Try accessing: https://rich-off-chain-backend-1.onrender.com/api/pools in your browser
• Wait 30-60 seconds and retry (Render free tier takes time to wake up)
• Verify backend is running if using localhost`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#1a1a1a] flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Side */}
      <div className="relative w-full md:w-1/2 bg-gradient-to-b from-yellow-500 via-yellow-600 to-yellow-800 flex flex-col items-center justify-center p-8 md:p-12 text-white">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 6px)",
          }}
        ></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <img
            src={assets.NewLogo}
            alt="Logo"
            className="drop-shadow-2xl opacity-90 mb-6 md:mb-8 rounded-full w-48 md:w-64"
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Invest in Bitcoin<br />
            Together Fairly<br />
            and Transparently.
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-sm">
            Join a global pool of investors and own.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-black overflow-auto">
        {/* Sign Up Form */}
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center justify-center ${
            isLogin ? "opacity-0 pointer-events-none translate-x-full" : "opacity-100 translate-x-0"
          }`}
        >
          <div className="w-full max-w-md bg-black/70 p-8 md:p-10 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">Welcome To RICH</h2>
            <p className="text-gray-400 text-sm text-center">Let's get started!</p>

            <div className="text-center">
              <span className="text-gray-400 text-sm">Already have an account? </span>
              <button
                onClick={toggleForm}
                className="text-yellow-500 text-sm font-semibold hover:text-yellow-400 hover:cursor-pointer transition-colors rounded-full px-3 py-1"
              >
                Sign in
              </button>
            </div>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Username (Optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-4 bg-transparent border border-yellow-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-500/10 border border-red-500 rounded-xl p-3 whitespace-pre-line">
                  {error}
                  {error.includes("Network error") && (
                    <div className="mt-2 text-xs text-yellow-400">
                      💡 Tip: If using Render.com free tier, wait 30-60 seconds for server to wake up, then retry.
                    </div>
                  )}
                </div>
              )}

              {account && (
                <div className="text-yellow-500 text-sm text-center bg-yellow-500/10 border border-yellow-500 rounded-xl p-3">
                  Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </div>
              )}

              <button
                onClick={handleWalletAuth}
                disabled={isLoading}
                className="w-full bg-transparent border-2 border-yellow-600 text-yellow-500 py-4 rounded-full font-bold hover:bg-yellow-600 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Connecting..." : account ? "SIGN MESSAGE TO AUTHENTICATE" : "CONNECT WALLET & SIGN UP"}
              </button>
            </div>
          </div>
        </div>

        {/* Sign In Form */}
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center justify-center ${
            isLogin ? "opacity-100 translate-x-0" : "opacity-0 pointer-events-none -translate-x-full"
          }`}
        >
          <div className="w-full max-w-md bg-black/70 p-8 md:p-10 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">Welcome Back!</h2>
            <p className="text-gray-400 text-sm text-center">
              So glad to see you again! Let's get you signed in.
            </p>

            <div className="text-center">
              <span className="text-gray-400 text-sm">Don't have an account? </span>
              <button
                onClick={toggleForm}
                className="text-yellow-500 text-sm font-semibold hover:text-yellow-400 transition-colors rounded-full px-3 py-1"
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Username (Optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-4 bg-transparent border border-yellow-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-500/10 border border-red-500 rounded-xl p-3 whitespace-pre-line">
                  {error}
                  {error.includes("Network error") && (
                    <div className="mt-2 text-xs text-yellow-400">
                      💡 Tip: If using Render.com free tier, wait 30-60 seconds for server to wake up, then retry.
                    </div>
                  )}
                </div>
              )}

              {account && (
                <div className="text-yellow-500 text-sm text-center bg-yellow-500/10 border border-yellow-500 rounded-xl p-3">
                  Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </div>
              )}

              <button
                onClick={handleWalletAuth}
                disabled={isLoading}
                className="w-full bg-transparent border-2 border-yellow-600 text-yellow-500 py-4 rounded-full font-bold hover:bg-yellow-600 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Authenticating..." : account ? "SIGN MESSAGE TO SIGN IN" : "CONNECT WALLET & SIGN IN"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSignUp;