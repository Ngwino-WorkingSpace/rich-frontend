import React from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";


const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-black text-white py-10 px-10 md:px-20">
            <div className="mt-10 border-t border-gray-800 pt-5 text-gray-500 text-sm text-center">
     
      </div>
      <div className="flex flex-col md:flex-row md:justify-around lg:justify-between items-start gap-10   pe-7">
        

        <div className="max-w-xs flex-1 px-12 sm:self-center-safe">
          <img src={assets.Rich} alt="Logo" className="w-28" />
          <p className="mt-3 text-gray-300 text-sm leading-relaxed">
            Making crypto simple, transparent, and open for everyone.
          </p>


          <div className="flex items-center gap-4 mt-6 text-yellow-400">
            <img src={assets.phone} alt="Phone" className="w-6 h-6 opacity-80 hover:opacity-100 cursor-pointer" />
            <img src={assets.telegram} alt="Telegram" className="w-6 h-6 opacity-80 hover:opacity-100 cursor-pointer" />
            <img src={assets.whatsapp} alt="WhatsApp" className="w-6 h-6 opacity-80 hover:opacity-100 cursor-pointer" />
            <img src={assets.instagram} alt="Instagram" className="w-6 h-6 opacity-80 hover:opacity-100 cursor-pointer" />
            <img src={assets.emailer} alt="Email" className="w-6 h-6 opacity-80 hover:opacity-100 cursor-pointer" />
          </div>
        </div>


        <div className="grid grid-cols-3 py-12 sm:grid-cols-3  gap-10 md:gap-16 flex-1 sm:self-center-safe">
          
     
          <div className="px-">
            <h3 className="font-semibold mb-3">Explore</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li onClick={() => navigate("/wallet")}  className="hover:text-yellow-400 cursor-pointer">Wallet</li>
              <li className="hover:text-yellow-400 cursor-pointer">Bitcoin Stats</li>
              <li className="hover:text-yellow-400 cursor-pointer">Visions</li>
            </ul>
          </div>

          <div className="px-4">
            <h3 className="font-semibold mb-3">Statistics</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="hover:text-yellow-400 cursor-pointer">Rankings</li>
              <li className="hover:text-yellow-400 cursor-pointer">Activity</li>
            </ul>
          </div>

       
          <div  className="px-5">
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="hover:text-yellow-400 cursor-pointer">About Us</li>
              <li className="hover:text-yellow-400 cursor-pointer">Careers</li>
              <li onClick={() => navigate("/support")}  className="hover:text-yellow-400 cursor-pointer">Support</li>
            </ul>
          </div>
        </div>
      </div>


      <div className="mt-10 border-t border-gray-800 pt-5 text-gray-500 text-sm text-center">
        © 2025 Rich — All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
