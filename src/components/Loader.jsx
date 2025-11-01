import React from "react";
import { motion } from "framer-motion";
import assets from "../assets/assets";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black space-y-6">
      <img src={assets.Rich} alt="Logo" className="w-60 h-60 animate-pulse" />
      {/* <motion.div
        className="w-14 h-14 border-4 border-yellow-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <p className="text-yellow-500 text-lg font-semibold">Loading...</p> */}
    </div>
  );
};

export default Loader;
