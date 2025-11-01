import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar.jsx";
import assets from "../assets/assets.js";
import { useWeb3 } from "../contexts/Web3Context";
import { api } from "../services/api";
import {
  Home,
  Flame,
  Wallet,
  Settings,
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  Bell,
  Menu,
  X,
} from "lucide-react";

export default function SettingsPage() {
  const { account } = useWeb3();
  
  // --- Profile ---
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(true);

  // --- Security ---
  const [showPwd, setShowPwd] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // --- Sidebar Toggle ---
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Recent Logins (simplified - backend doesn't provide this) ---
  const [logins] = useState([
    { date: new Date().toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }), device: "Current Session", status: "Confirmed" },
  ]);

  useEffect(() => {
    if (account) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [account]);

  const fetchUserData = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const response = await api.getUser(account);
      const user = response.user || {};
      
      setUsername(user.userName || "");
      setFullName(user.fullName || user.userName || "");
      setEmail(user.email || "");
      setDob(user.dateOfBirth || "");
      setLoginAlerts(user.notifications !== false); // Default to true if not set
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Backup for Cancel ---
  const [backup, setBackup] = useState({ fullName: "", username: "", email: "", dob: "", loginAlerts: true });

  useEffect(() => {
    setBackup({ fullName, username, email, dob, loginAlerts });
  }, [loading]); // Only set backup after initial load

  const handleSave = async () => {
    if (!account) {
      alert("Please connect your wallet");
      return;
    }

    try {
      const updates = {
        userName: username,
        notifications: loginAlerts
      };

      // Only include fields that have values
      if (fullName) updates.fullName = fullName;
      if (email) updates.email = email;
      if (dob) updates.dateOfBirth = dob;

      await api.updateUser(account, updates);
      setBackup({ fullName, username, email, dob, loginAlerts });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(`Failed to save settings: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setFullName(backup.fullName);
    setUsername(backup.username);
    setEmail(backup.email);
    setDob(backup.dob);
    setLoginAlerts(backup.loginAlerts);
  };

  return (
    <div className="min-h-screen bg-black text-yellow-500 flex flex-col md:flex-row">
      {/* --- Sidebar --- */}
      <div
        className={`fixed md:static z-40 bg-black border-r border-gray-800 h-screen transition-all duration-300 ${
          sidebarOpen ? "left-0" : "-left-64"
        } w-64`}
      >
        <Sidebar />
      </div>

      {/* --- Overlay for mobile --- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- Main --- */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        {/* --- Header --- */}
        <header className="flex flex-wrap items-center justify-between mb-6 md:mb-8 gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <button
              className="md:hidden p-2 rounded-md border border-gray-700 hover:bg-gray-800"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-white bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm border border-yellow-500">
              {loading ? '...' : (username ? username.charAt(0).toUpperCase() : account ? account.charAt(2).toUpperCase() : 'G')}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[120px] sm:max-w-[150px]">
                {loading ? 'Loading...' : (username || (account ? 'Guest' : 'Not connected'))}
              </span>
              <span className="text-xs opacity-70">
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect wallet'}
              </span>
            </div>
          </div>
        </header>

        {/* --- Panels --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT PANEL */}
          <section className="bg-black p-5 sm:p-6 rounded-2xl border border-[#f7931a] space-y-6 shadow-lg">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-full overflow-hidden border-4 border-yellow-500">
                  <img src={assets.globe} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-1 right-1 bg-yellow-500 p-2 rounded-full hover:bg-yellow-400 transition">
                  <Camera className="w-5 h-5 text-black" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full justify-center">
                <button className="text-sm px-4 sm:px-5 py-2 border border-[#f7931a] rounded-2xl hover:bg-[#f7931a] hover:text-black transition w-full sm:w-auto text-center">
                  Change Photo
                </button>
                <button className="text-sm px-4 sm:px-5 py-2 border border-[#f7931a] rounded-2xl hover:bg-[#f7931a] hover:text-black transition w-full sm:w-auto text-center">
                  Remove Photo
                </button>
              </div>
            </div>

            {/* Fields */}
            {loading ? (
              <div className="text-yellow-400 text-center py-4">Loading user data...</div>
            ) : !account ? (
              <div className="text-gray-400 text-center py-4">Please connect your wallet to view settings</div>
            ) : (
              [
                { icon: User, label: "Full Name", value: fullName, set: setFullName, placeholder: "Enter full name" },
                { icon: User, label: "Username", value: username, set: setUsername, placeholder: "Enter username", required: true },
                { icon: Mail, label: "Email Address", value: email, set: setEmail, type: "email", placeholder: "Enter email (optional)" },
                { icon: Calendar, label: "Date of Birth", value: dob, set: setDob, type: "date", placeholder: "Select date" },
              ].map((f) => (
                <div key={f.label} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full">
                  <f.icon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <div className="flex-1 w-full">
                    <label className="block text-xs text-gray-400">{f.label}{f.required && ' *'}</label>
                    <input
                      type={f.type ?? "text"}
                      value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full bg-transparent border-b border-gray-700 text-white focus:outline-none focus:border-yellow-500 pb-1 placeholder-gray-600"
                    />
                  </div>
                </div>
              ))
            )}

            {/* Buttons */}
            {account && !loading && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={!username.trim()}
                  className="flex-1 py-2 bg-transparent border border-[#f7931a] rounded hover:bg-[#f7931a] hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2 border border-[#f7931a] rounded text-yellow-500 hover:bg-[#f7931a] hover:text-black transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </section>

          {/* RIGHT PANEL */}
          <section className="bg-black p-5 sm:p-6 rounded-2xl border border-[#f7931a] space-y-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold">Security Settings</h2>

            {/* Password - Note: Wallet-based auth doesn't use passwords */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Authentication</label>
              <div className="relative">
                <input
                  type="text"
                  value={account ? `Wallet: ${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
                  readOnly
                  className="w-full bg-transparent border-b border-gray-700 text-white pb-1 pr-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your wallet signature is used for authentication. No password required.
              </p>
            </div>

            {/* Login Alerts Toggle */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">Login Alerts</span>
                </div>
                <button
                  onClick={() => setLoginAlerts(!loginAlerts)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                    loginAlerts ? "bg-yellow-500" : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-black transition ${
                      loginAlerts ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Recent Login Activity */}
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-3">Recent Login Activity</h3>
              <div className="space-y-3">
                {logins.map((login, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/40 px-4 py-3 rounded-lg border border-gray-800"
                  >
                    <div className="mb-2 sm:mb-0">
                      <div className="text-sm">{login.date}</div>
                      <div className="text-xs text-gray-400">{login.device}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {login.status === "Confirmed" ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-xs text-green-500 font-medium">Confirmed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-500" />
                          <button className="text-xs text-red-500 font-medium hover:underline">
                            Revoke
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
