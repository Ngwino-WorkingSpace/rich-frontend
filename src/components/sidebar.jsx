import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // hamburger icons
import assets from "../assets/assets";

const menuItems = [
  { label: "Wallet & Fiat", icon: assets.wallet, to: "/wallet" },
  { label: "Dashboard", icon: assets.dashboard, to: "/dashboard" },
  { label: "Markets", icon: assets.markets, to: "/markets" },
  { label: "Settings", icon: assets.settings, to: "/settings" },
  { label: "Support", icon: assets.support, to: "/support" },
  { label: "Pools", icon: assets.pools, to: "/pool" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // mobile toggle

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-black flex justify-between items-center px-4 py-3 border-b border-gray-800 z-50">
        <img
          onClick={() => navigate("/")}
          src={assets.Rich}
          alt="Rich Logo"
          className="h-8 w-auto cursor-pointer"
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-yellow-500 focus:outline-none"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-black border-r border-gray-800 flex flex-col py-6 px-4 transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64`}
      >
        {/* Logo */}
        <div className="px-2 mb-10 hidden md:flex flex-col items-center">
          <img
            onClick={() => navigate("/")}
            src={assets.Rich}
            alt="Rich Logo"
            className="h-12 md:h-14 w-auto cursor-pointer"
          />
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-2 md:px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 group justify-center md:justify-start ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-400 border border-yellow-600/50 shadow-lg shadow-yellow-500/10"
                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`
              }
              onClick={() => setIsOpen(false)} // close sidebar on mobile
            >
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span className="text-sm font-medium hidden md:inline">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Background overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
