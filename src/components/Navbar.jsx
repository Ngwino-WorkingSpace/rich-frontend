import { useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-black text-white shadow-md">
 
      <div className="w-full flex items-center justify-between py-4 px-4 md:px-8">

        <div className="flex items-center">
          <img src={assets.Rich} alt="Logo" className="w-24 md:w-28 object-contain" />
        </div>


        <div className="hidden md:flex items-center space-x-8">
          <a href="/markets" className="text-gray-300 hover:text-yellow-400 text-sm transition">
            Markets
          </a>
          <a href="/support" className="text-gray-300 hover:text-yellow-400 text-sm transition">
            Support
          </a>
          <a href="/pool" className="text-gray-300 hover:text-yellow-400 text-sm transition">
            Pools
         </a>
           {/* <a href="#" className="text-gray-300 hover:text-yellow-400 text-sm transition">
            About
          </a> */}
          <button onClick={() => navigate("/login")} className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded-full transition">
            Get Started
          </button>
        </div>


        <button
          className="md:hidden text-gray-300 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

     
      {isOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 px-6 py-4 space-y-3">
          <a href="/markets" className="block text-gray-300 hover:text-yellow-400 text-sm transition">
            Markets
          </a>
          <a href="/support" className="block text-gray-300 hover:text-yellow-400 text-sm transition">
            support
          </a>
          <a href="/pool" className="block text-gray-300 hover:text-yellow-400 text-sm transition">
            Pools
          </a>
          {/* <a href="#" className="block text-gray-300 hover:text-yellow-400 text-sm transition">
            About
          </a> */}
          <button onClick={() => navigate("/connect")} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-full transition">
            Connect To Wallet
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
