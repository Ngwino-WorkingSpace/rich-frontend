import React, { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import assets from "../assets/assets.js";
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
  // --- Profile ---
  const [fullName, setFullName] = useState("Will Smith");
  const [username, setUsername] = useState("Big McDonalds");
  const [email, setEmail] = useState("willmcd@gmail.com");
  const [dob, setDob] = useState("1982-12-31");

  // --- Security ---
  const [showPwd, setShowPwd] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // --- Sidebar Toggle ---
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Recent Logins ---
  const logins = [
    { date: "10/29/2025 10:23 AM", device: "Vizio Smart TV", status: "Confirmed" },
    { date: "09/01/2025 9:13 PM", device: "Unknown Device", status: "Revoke" },
  ];

  // --- Backup for Cancel ---
  const [backup] = useState({ fullName, username, email, dob, loginAlerts });

  const handleSave = () => alert("Settings saved!");
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
            <img
              src={assets.globe}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-yellow-500"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[120px] sm:max-w-[150px]">
                Big McDonalds
              </span>
              <span className="text-xs opacity-70">13/01/2027</span>
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
            {[
              { icon: User, label: "Full Name", value: fullName, set: setFullName },
              { icon: User, label: "Username", value: username, set: setUsername },
              { icon: Mail, label: "Email Address", value: email, set: setEmail, type: "email" },
              { icon: Calendar, label: "Date of Birth", value: dob, set: setDob, type: "date" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full">
                <f.icon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <div className="flex-1 w-full">
                  <label className="block text-xs text-gray-400">{f.label}</label>
                  <input
                    type={f.type ?? "text"}
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-700 text-white focus:outline-none focus:border-yellow-500 pb-1"
                  />
                </div>
              </div>
            ))}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-transparent border border-[#f7931a] rounded hover:bg-[#f7931a] hover:text-black transition"
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
          </section>

          {/* RIGHT PANEL */}
          <section className="bg-black p-5 sm:p-6 rounded-2xl border border-[#f7931a] space-y-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold">Security Settings</h2>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value="••••••••"
                  readOnly
                  className="w-full bg-transparent border-b border-gray-700 text-white pb-1 pr-10"
                />
                <button
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-0 top-1 text-gray-400 hover:text-yellow-500 transition"
                >
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button className="text-sm hover:text-yellow-400">Change Password</button>
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
