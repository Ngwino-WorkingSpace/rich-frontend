import React, { useEffect, useState } from "react";
import SupportInfo from "./SupportInfo";
import SupportForm from "./SupportForm";
import Sidebar from "../sidebar";
import assets from "../../assets/assets";
import { Menu, X } from "lucide-react";

const Topbar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-900 w-full">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden p-2 rounded-md border border-gray-700 hover:bg-gray-800"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
        <span className="font-semibold text-xl md:text-2xl bg-gradient-to-r from-yellow-400 via-yellow-200 to-white bg-clip-text text-transparent">
          Support Center
        </span>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <img
          src={assets.profile}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border border-yellow-600/50"
        />
        <div className="text-right">
          <div className="text-white text-base">Big McDonalds</div>
          <div className="text-xs md:text-sm text-gray-500">151210122027</div>
        </div>
      </div>
    </div>
  );
};

const SupportPage = () => {
  const [_, setTick] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setTick((t) => t + 1);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-poppins flex flex-col md:flex-row w-full">
      {/* Sidebar */}
      <div
        className={`fixed md:static z-40 bg-black border-r border-gray-800 h-screen transition-all duration-300 w-64 ${
          sidebarOpen ? "left-0" : "-left-64"
        }`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-h-screen flex flex-col w-full">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 w-full px-2 md:px-6 py-3">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
            <div className="w-full h-full p-2 md:p-4">
              <SupportInfo />
            </div>
            <div className="w-full h-full p-2 md:p-4">
              <SupportForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
