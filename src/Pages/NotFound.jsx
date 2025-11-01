// src/Pages/NotFound.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import assets from "../assets/assets";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center">
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-8xl font-extrabold  text-yellow-500 drop-shadow-lg"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-2xl mt-4 text-gray-300"
      >
        Oops! The page you’re looking for doesn’t exist.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8"
      >
        <Link
          to="/"
          className="px-6 py-3 text-yellow-500 bg-black font-semibold rounded-xl hover:bg-yellow-500 hover:text-black transition-all duration-300"
        >
          Go Back Home
        </Link>
      </motion.div>

     
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 text-gray-400 text-sm"
      >
        Keep exploring the universe of Rich <img src={assets.Rich} alt="" className="w-30 h-30" />
      </motion.div>
    </div>
  );
};

export default NotFound;
