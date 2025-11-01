import React from "react";
import assets from "../assets/assets";

const MapCard = () => {
  return (
    <section className="w-full bg-[#1a1a1a] border-4 border-[#f1b930] text-center text-white py-10 px-6 md:px-16">
   
      <h2 className="text-4xl md:text-5xl font-semibold flex items-center justify-center gap-2 flex-wrap 
        bg-gradient-to-r from-[#f1b930] via-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent py-6">
        Use
        <img
          src={assets.logo}
          alt="Rich Logo"
          className="w-32 md:w-40 inline-block object-contain align-middle"
        />
        from anywhere
      </h2>


      <p className="text-gray-300 max-w-3xl mx-auto mb-10 text-sm md:text-base leading-relaxed mt-2">
        <span className="italic font-serif text-[#f1b930]">Rich</span> connects people everywhere —
        from startups to seasoned traders — through one transparent, decentralized system.  
        Wherever you are, you can join, contribute, and grow your wealth alongside a global community.
      </p>

  
      <div className="relative w-full flex justify-center">
        <img
          src={assets.map}
          alt="World Map"
          className="rounded-xl w-full md:w-10/12 h-auto shadow-lg border border-[#f1b930]/30"
        />
      </div>
    </section>
  );
};

export default MapCard;
