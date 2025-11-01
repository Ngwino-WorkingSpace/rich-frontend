'use client';
import React, { useState, useEffect } from "react";
import assets from "../assets/assets";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useWeb3 } from "../contexts/Web3Context";
import { api } from "../services/api";

const poolsTop = [
  {
    name: "Pool Alpha",
    by: "Alexander D",
    members: 120,
    desc: "A pool for Medium-term BTC growth with weekly buys.",
  },
  {
    name: "AndraBag",
    by: "Will Chrisset",
    members: 90,
    desc: "Mixed strategy pool with dollar-cost averaging enabled.",
  },
  {
    name: "Pool Memphis",
    by: "Linda Manya",
    members: 27,
    desc: "A pool for aggressive weekly buys managed by experts.",
  },
];

const myPools = [
  { name: "Physic Tied", by: "Alex Newton", members: 96 },
  { name: "Lama pitPool", by: "Samuel U", members: 14 },
  { name: "Pool Alpha", by: "Alexander D", members: 120 },
];

const Card = ({ name, by, members, desc, compact = false }) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border-2 border-yellow-500/80 bg-black/60 p-5 sm:p-6 md:p-7 shadow-[0_0_20px_rgba(250,204,21,0.08)] text-white font-poppins h-full transition-transform hover:scale-[1.01] duration-200">
      <div className="text-xl sm:text-2xl md:text-3xl font-semibold mb-1">{name}</div>
      <div className="text-yellow-400 text-sm sm:text-base md:text-lg mb-3">By {by}</div>
      <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base md:text-lg mb-3">
        <img src={assets.Rich} alt="members" className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="font-semibold text-white">{members} Members</span>
      </div>
      {!compact && (
        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4 line-clamp-2">
          {desc}
        </p>
      )}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/pool-details")}
          className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition font-semibold text-sm sm:text-base md:text-lg"
        >
          Details
        </button>
        <button
          onClick={() => navigate("/pool-details")}
          className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition font-semibold text-sm sm:text-base md:text-lg"
        >
          Join
        </button>
      </div>
    </div>
  );
};

const PoolPage = () => {
  const { account } = useWeb3();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (account) {
      fetchUserData();
    }
  }, [account]);

  const fetchUserData = async () => {
    if (!account) return;
    try {
      const response = await api.getUser(account);
      setUserData(response.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-poppins flex flex-col md:flex-row transition-all duration-300">
      {/* Sidebar (mobile responsive) */}
      <div
        className={`fixed md:static z-30 bg-black border-r border-gray-800 transition-all duration-300 ${
          sidebarOpen ? "left-0" : "-left-64"
        } md:left-0 w-64 h-screen`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Mobile Navbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-7 h-7 text-yellow-500" />
          </button>
          <h1 className="text-xl font-bold italic text-yellow-500">Pools</h1>
        </div>

        {/* Top Bar (Desktop) */}
        <div className="hidden md:flex items-center justify-between px-6 py-5 border-b border-gray-900 w-full">
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-white bg-clip-text text-transparent font-bold text-3xl tracking-wide">
            POOL MANAGEMENT
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold border border-yellow-600/60">
              {userData?.userName ? userData.userName.charAt(0).toUpperCase() : account ? account.charAt(2).toUpperCase() : 'G'}
            </div>
            <div className="text-right leading-5">
              <div className="text-white text-lg md:text-xl font-semibold">
                {userData?.userName || (account ? 'Guest' : 'Not connected')}
              </div>
              <div className="text-xs md:text-sm text-gray-500">
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect wallet'}
              </div>
            </div>
          </div>
        </div>

        {/* Page Body */}
        <div className="px-4 sm:px-5 md:px-6 py-6 flex-1 flex flex-col">
          {/* Search + CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-auto flex-1">
              <img
                src={assets.Searchimage}
                alt="search"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-80"
              />
              <input
                placeholder="Search a pool name"
                className="w-full bg-transparent border-2 border-yellow-500/70 rounded-full pl-11 pr-4 py-2.5 sm:py-3 text-yellow-100 placeholder:text-yellow-300/70 outline-none text-sm sm:text-base md:text-lg"
              />
            </div>
            <button className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition font-semibold text-sm sm:text-base md:text-lg">
              View more pools
            </button>
          </div>

          {/* Top Pools */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-4">
            Top Pools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 flex-1">
            {poolsTop.map((p) => (
              <Card key={p.name} {...p} />
            ))}
          </div>

          {/* My Pools Header */}
          <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
            <div className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-white bg-clip-text text-transparent font-bold text-2xl md:text-3xl tracking-wide">
              MY POOLS
            </div>
            <button
              onClick={() => navigate("/create-pool")}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-black text-2xl font-bold shadow hover:opacity-90"
              title="Add Pool"
            >
              +
            </button>
          </div>

          {/* My Pools Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 pb-10">
            {myPools.map((p) => (
              <Card key={p.name} {...p} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolPage;
