'use client';
import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import BTCChart from './components/BTCChart';
import Wallet from './components/Wallet';
import Nav from './components/shortnavbar';
import Recent from './components/Recent';
import { Menu } from 'lucide-react';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-black text-white flex flex-col md:flex-row transition-all duration-300">
        {/* Sidebar (responsive) */}
        <div
          className={`fixed md:static z-30 bg-black border-r border-gray-800 transition-all duration-300 ${
            sidebarOpen ? 'left-0' : '-left-64'
          } md:left-0 w-64 h-screen`}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Navbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 md:hidden">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-7 h-7 text-yellow-500" />
            </button>
            <h1 className="text-xl font-bold italic text-yellow-500">Dashboard</h1>
          </div>

          {/* Top Nav (Desktop) */}

          {/* Main Layout */}
          <main className="flex flex-col lg:flex-row flex-1 w-full min-w-0 px-4 md:px-6 py-6 gap-6 overflow-x-hidden">
            {/* Left Section */}
            <section className="flex-1 flex flex-col gap-8 min-w-0 order-1 lg:order-none">
              {/* BTC Chart */}
              <div className="w-full overflow-hidden">
                <BTCChart />
              </div>

              {/* Recent Transactions Table */}
              <div className="overflow-x-auto w-full">
                <div className="min-w-[500px] md:min-w-[700px] max-w-full">
                  <Recent />
                </div>
              </div>

              {/* Wallet (shown only on mobile/tablet) */}
              <div className="mt-8 lg:hidden block">
                <Wallet />
              </div>
            </section>

            {/* Right Sidebar (Desktop only) */}
            <aside className="hidden lg:flex lg:w-[370px] flex-col min-w-0 px-4 pt-2">
              <Wallet />
            </aside>
          </main>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
