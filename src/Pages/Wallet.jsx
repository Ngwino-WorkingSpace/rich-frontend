import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import BalanceCard from "../components/BalanceCards";
import TransactionsCard from "../components/Transactions";
import EFYCard from "../components/EFY";
import WalletCard from "../components/walletCard";
import { Menu, X } from "lucide-react";

const WalletPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
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
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Custom Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-900">
          {/* Sidebar toggle button */}
          <button
            className="md:hidden p-2 rounded-md border border-gray-700 hover:bg-gray-800"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>

          {/* Header text */}
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-200 to-white bg-clip-text text-transparent">
            Welcome Sandra !
          </h1>
        </div>

        <main className="flex-1 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left side (2 columns span) */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-4 sm:gap-6">
            {/* Top: Total Balance */}
            <BalanceCard />

            <div className="flex flex-col md:flex-row justify-between gap-4">
              {/* Bottom: Transactions */}
              <TransactionsCard />
              {/* Bottom: EFY Card */}
              <EFYCard />
            </div>
          </div>

          {/* Right side */}
          <div className="md:col-span-1 lg:col-span-1 flex flex-col gap-4 sm:gap-6">
            {/* Top: Wallet */}
            <WalletCard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default WalletPage;
